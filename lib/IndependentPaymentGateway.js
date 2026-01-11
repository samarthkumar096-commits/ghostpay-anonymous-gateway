// ============================================
// INDEPENDENT PAYMENT GATEWAY
// Direct Bank Integration + Crypto + UPI
// ============================================

const crypto = require('crypto');
const axios = require('axios');

class IndependentPaymentGateway {
  constructor() {
    this.transactions = new Map();
    this.merchants = new Map();
    this.settlements = new Map();
    
    // Exchange rates
    this.rates = {
      USD_TO_INR: 83.12,
      INR_TO_USD: 0.012,
      USDT_TO_INR: 83.12,
      USDT_TO_USD: 1.00
    };
  }

  // ============================================
  // MERCHANT REGISTRATION
  // ============================================
  registerMerchant(data) {
    const merchantId = 'MERCH_' + crypto.randomBytes(16).toString('hex');
    const apiKey = 'API_' + crypto.randomBytes(32).toString('hex');
    const apiSecret = crypto.randomBytes(32).toString('hex');

    const merchant = {
      merchantId,
      apiKey,
      apiSecret,
      businessName: data.businessName,
      email: data.email,
      phone: data.phone,
      bankDetails: {
        accountNumber: data.accountNumber,
        ifsc: data.ifsc,
        accountName: data.accountName,
        bankName: data.bankName
      },
      upiId: data.upiId,
      cryptoWallets: {
        usdt: data.usdtAddress,
        btc: data.btcAddress,
        eth: data.ethAddress
      },
      status: 'active',
      balance: 0,
      totalProcessed: 0,
      createdAt: new Date()
    };

    this.merchants.set(merchantId, merchant);

    return {
      success: true,
      merchantId,
      apiKey,
      apiSecret,
      message: 'Merchant registered successfully',
      webhookUrl: `https://yourdomain.com/webhooks/${merchantId}`
    };
  }

  // ============================================
  // UPI PAYMENT PROCESSING (Direct)
  // ============================================
  async createUPIPayment(merchantId, data) {
    try {
      const merchant = this.merchants.get(merchantId);
      if (!merchant) throw new Error('Invalid merchant');

      const paymentId = 'PAY_' + crypto.randomBytes(16).toString('hex');
      const orderId = data.orderId || 'ORD_' + Date.now();

      // Generate UPI payment request
      const upiString = this.generateUPIString({
        pa: merchant.upiId, // Merchant's UPI ID
        pn: merchant.businessName,
        am: data.amount,
        cu: 'INR',
        tn: `Payment for ${orderId}`,
        tr: paymentId
      });

      const payment = {
        paymentId,
        orderId,
        merchantId,
        amount: data.amount,
        currency: 'INR',
        method: 'UPI',
        status: 'pending',
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        upiString,
        qrCode: await this.generateQRCode(upiString),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        createdAt: new Date(),
        metadata: data.metadata
      };

      this.transactions.set(paymentId, payment);

      return {
        success: true,
        paymentId,
        orderId,
        amount: data.amount,
        currency: 'INR',
        upiString,
        qrCode: payment.qrCode,
        expiresIn: 900, // seconds
        instructions: [
          'Open any UPI app (Google Pay, PhonePe, Paytm)',
          'Scan QR code or enter UPI ID',
          `Pay ₹${data.amount}`,
          'Payment will be confirmed automatically'
        ]
      };
    } catch (error) {
      throw error;
    }
  }

  generateUPIString(params) {
    const { pa, pn, am, cu, tn, tr } = params;
    return `upi://pay?pa=${pa}&pn=${encodeURIComponent(pn)}&am=${am}&cu=${cu}&tn=${encodeURIComponent(tn)}&tr=${tr}`;
  }

  // ============================================
  // CRYPTO PAYMENT PROCESSING (Direct)
  // ============================================
  async createCryptoPayment(merchantId, data) {
    try {
      const merchant = this.merchants.get(merchantId);
      if (!merchant) throw new Error('Invalid merchant');

      const paymentId = 'CRYPTO_' + crypto.randomBytes(16).toString('hex');
      const cryptoType = data.cryptoType || 'USDT';

      // Get merchant's crypto address
      const address = merchant.cryptoWallets[cryptoType.toLowerCase()];
      if (!address) throw new Error(`${cryptoType} wallet not configured`);

      // Calculate crypto amount
      let cryptoAmount;
      if (data.currency === 'INR') {
        cryptoAmount = data.amount / this.rates.USDT_TO_INR;
      } else {
        cryptoAmount = data.amount / this.rates.USDT_TO_USD;
      }

      const payment = {
        paymentId,
        orderId: data.orderId || 'ORD_' + Date.now(),
        merchantId,
        amount: data.amount,
        currency: data.currency,
        cryptoAmount: parseFloat(cryptoAmount.toFixed(6)),
        cryptoType,
        method: 'CRYPTO',
        status: 'pending',
        address,
        network: cryptoType === 'USDT' ? 'TRC20' : cryptoType,
        customerEmail: data.customerEmail,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        createdAt: new Date(),
        confirmations: 0,
        requiredConfirmations: cryptoType === 'USDT' ? 1 : 3
      };

      this.transactions.set(paymentId, payment);

      return {
        success: true,
        paymentId,
        cryptoType,
        amount: cryptoAmount,
        address,
        network: payment.network,
        qrCode: await this.generateQRCode(`${cryptoType.toLowerCase()}:${address}?amount=${cryptoAmount}`),
        expiresIn: 1800,
        instructions: [
          `Send exactly ${cryptoAmount} ${cryptoType}`,
          `Network: ${payment.network}`,
          `Address: ${address}`,
          'Payment will be confirmed in 1-5 minutes',
          `⚠️ Only send ${cryptoType} on ${payment.network} network`
        ]
      };
    } catch (error) {
      throw error;
    }
  }

  // ============================================
  // BANK TRANSFER (Direct)
  // ============================================
  async createBankTransfer(merchantId, data) {
    try {
      const merchant = this.merchants.get(merchantId);
      if (!merchant) throw new Error('Invalid merchant');

      const paymentId = 'BANK_' + crypto.randomBytes(16).toString('hex');
      const referenceId = 'REF_' + Date.now();

      const payment = {
        paymentId,
        orderId: data.orderId || 'ORD_' + Date.now(),
        merchantId,
        amount: data.amount,
        currency: data.currency || 'INR',
        method: 'BANK_TRANSFER',
        status: 'pending',
        referenceId,
        bankDetails: merchant.bankDetails,
        customerEmail: data.customerEmail,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        createdAt: new Date()
      };

      this.transactions.set(paymentId, payment);

      return {
        success: true,
        paymentId,
        referenceId,
        amount: data.amount,
        currency: payment.currency,
        bankDetails: {
          accountName: merchant.bankDetails.accountName,
          accountNumber: merchant.bankDetails.accountNumber,
          ifsc: merchant.bankDetails.ifsc,
          bankName: merchant.bankDetails.bankName
        },
        instructions: [
          'Transfer amount to the bank account above',
          `Reference: ${referenceId}`,
          'Payment will be verified within 1-2 hours',
          'Keep transaction receipt for verification'
        ]
      };
    } catch (error) {
      throw error;
    }
  }

  // ============================================
  // PAYMENT VERIFICATION
  // ============================================
  async verifyPayment(paymentId, verificationData) {
    try {
      const payment = this.transactions.get(paymentId);
      if (!payment) throw new Error('Payment not found');

      // Verify based on payment method
      let verified = false;

      switch (payment.method) {
        case 'UPI':
          verified = await this.verifyUPIPayment(payment, verificationData);
          break;
        case 'CRYPTO':
          verified = await this.verifyCryptoPayment(payment, verificationData);
          break;
        case 'BANK_TRANSFER':
          verified = await this.verifyBankTransfer(payment, verificationData);
          break;
      }

      if (verified) {
        payment.status = 'success';
        payment.completedAt = new Date();
        payment.transactionHash = verificationData.txHash || verificationData.utr;

        // Update merchant balance
        const merchant = this.merchants.get(payment.merchantId);
        merchant.balance += payment.amount;
        merchant.totalProcessed += payment.amount;

        // Trigger webhook
        await this.triggerWebhook(payment);

        return {
          success: true,
          verified: true,
          payment: {
            paymentId: payment.paymentId,
            status: payment.status,
            amount: payment.amount,
            completedAt: payment.completedAt
          }
        };
      } else {
        return {
          success: false,
          verified: false,
          error: 'Payment verification failed'
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async verifyUPIPayment(payment, data) {
    // In production: Verify with bank API
    // For now: Simulate verification
    return data.utr && data.utr.length > 10;
  }

  async verifyCryptoPayment(payment, data) {
    // In production: Check blockchain
    // For now: Simulate verification
    if (data.txHash && data.txHash.length > 40) {
      payment.confirmations = data.confirmations || 1;
      return payment.confirmations >= payment.requiredConfirmations;
    }
    return false;
  }

  async verifyBankTransfer(payment, data) {
    // In production: Verify with bank statement API
    // For now: Manual verification
    return data.utr && data.verified === true;
  }

  // ============================================
  // SETTLEMENT (Payout to Merchant)
  // ============================================
  async createSettlement(merchantId, amount) {
    try {
      const merchant = this.merchants.get(merchantId);
      if (!merchant) throw new Error('Invalid merchant');

      if (merchant.balance < amount) {
        throw new Error('Insufficient balance');
      }

      const settlementId = 'SETTLE_' + crypto.randomBytes(16).toString('hex');

      const settlement = {
        settlementId,
        merchantId,
        amount,
        status: 'processing',
        bankDetails: merchant.bankDetails,
        upiId: merchant.upiId,
        createdAt: new Date(),
        estimatedTime: '1-2 hours'
      };

      this.settlements.set(settlementId, settlement);

      // Deduct from merchant balance
      merchant.balance -= amount;

      // In production: Initiate actual bank transfer
      // For now: Simulate
      setTimeout(() => {
        settlement.status = 'completed';
        settlement.completedAt = new Date();
        settlement.utr = 'UTR' + Date.now();
      }, 5000);

      return {
        success: true,
        settlementId,
        amount,
        status: settlement.status,
        estimatedTime: settlement.estimatedTime
      };
    } catch (error) {
      throw error;
    }
  }

  // ============================================
  // WEBHOOK TRIGGER
  // ============================================
  async triggerWebhook(payment) {
    const merchant = this.merchants.get(payment.merchantId);
    if (!merchant.webhookUrl) return;

    try {
      await axios.post(merchant.webhookUrl, {
        event: 'payment.success',
        paymentId: payment.paymentId,
        orderId: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        completedAt: payment.completedAt
      }, {
        headers: {
          'X-Signature': this.generateSignature(payment, merchant.apiSecret)
        }
      });
    } catch (error) {
      console.error('Webhook failed:', error.message);
    }
  }

  generateSignature(data, secret) {
    return crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(data))
      .digest('hex');
  }

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  async generateQRCode(data) {
    const QRCode = require('qrcode');
    return await QRCode.toDataURL(data);
  }

  getPaymentStatus(paymentId) {
    const payment = this.transactions.get(paymentId);
    if (!payment) throw new Error('Payment not found');

    return {
      success: true,
      payment: {
        paymentId: payment.paymentId,
        orderId: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        createdAt: payment.createdAt,
        completedAt: payment.completedAt
      }
    };
  }

  getMerchantBalance(merchantId) {
    const merchant = this.merchants.get(merchantId);
    if (!merchant) throw new Error('Invalid merchant');

    return {
      success: true,
      balance: merchant.balance,
      totalProcessed: merchant.totalProcessed,
      currency: 'INR'
    };
  }
}

module.exports = IndependentPaymentGateway;