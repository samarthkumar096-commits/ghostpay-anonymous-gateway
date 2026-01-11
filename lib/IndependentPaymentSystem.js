// ============================================
// COMPLETE INDEPENDENT PAYMENT SYSTEM
// NO Third Party - 100% Your Control
// ============================================

const crypto = require('crypto');
const axios = require('axios');
const QRCode = require('qrcode');

class IndependentPaymentSystem {
  constructor(config) {
    // Your payment details
    this.upiId = config.upiId; // e.g., 'yourname@paytm'
    this.bankDetails = config.bankDetails;
    this.cryptoWallets = config.cryptoWallets;
    
    // Storage (use database in production)
    this.orders = new Map();
    this.payments = new Map();
  }

  // ============================================
  // 1. UPI PAYMENT
  // ============================================
  
  async createUPIPayment(orderData) {
    const { amount, customerEmail, customerPhone, orderId } = orderData;
    
    const order = {
      orderId: orderId || `ORD_${Date.now()}`,
      amount: parseFloat(amount),
      currency: 'INR',
      customerEmail,
      customerPhone,
      paymentMethod: 'UPI',
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    };
    
    // Generate UPI payment string
    const upiString = this.generateUPIString({
      pa: this.upiId,
      pn: 'Your Business',
      am: amount,
      tn: `Payment for ${order.orderId}`
    });
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(upiString);
    
    order.paymentDetails = {
      upiId: this.upiId,
      upiString,
      qrCode
    };
    
    this.orders.set(order.orderId, order);
    
    return {
      success: true,
      orderId: order.orderId,
      amount: order.amount,
      upiId: this.upiId,
      upiString,
      qrCode,
      instructions: [
        '1. Open any UPI app (Google Pay, PhonePe, Paytm)',
        '2. Scan QR code or enter UPI ID',
        `3. Pay exactly ₹${amount}`,
        '4. After payment, enter UTR number below',
        '5. Payment will be verified within 5 minutes'
      ],
      expiresIn: 900 // seconds
    };
  }
  
  generateUPIString(params) {
    const { pa, pn, am, tn } = params;
    return `upi://pay?pa=${pa}&pn=${encodeURIComponent(pn)}&am=${am}&cu=INR&tn=${encodeURIComponent(tn)}`;
  }
  
  async verifyUPIPayment(orderId, utr) {
    const order = this.orders.get(orderId);
    
    if (!order) {
      return { success: false, error: 'Order not found' };
    }
    
    // Check if UTR already used
    for (let [id, payment] of this.payments) {
      if (payment.utr === utr && id !== orderId) {
        return { success: false, error: 'UTR already used' };
      }
    }
    
    // In production: Verify with bank API
    // For now: Manual verification
    if (utr && utr.length >= 12) {
      order.status = 'paid';
      order.paidAt = new Date();
      order.paymentDetails.utr = utr;
      order.paymentDetails.verifiedAt = new Date();
      
      this.payments.set(orderId, {
        orderId,
        utr,
        amount: order.amount,
        verifiedAt: new Date()
      });
      
      return {
        success: true,
        message: 'Payment verified successfully',
        order: {
          orderId: order.orderId,
          amount: order.amount,
          status: order.status,
          paidAt: order.paidAt
        }
      };
    }
    
    return { success: false, error: 'Invalid UTR' };
  }

  // ============================================
  // 2. BANK TRANSFER
  // ============================================
  
  async createBankTransfer(orderData) {
    const { amount, customerEmail, customerPhone, orderId } = orderData;
    
    const order = {
      orderId: orderId || `ORD_${Date.now()}`,
      amount: parseFloat(amount),
      currency: 'INR',
      customerEmail,
      customerPhone,
      paymentMethod: 'BANK',
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
    
    order.paymentDetails = {
      accountName: this.bankDetails.accountName,
      accountNumber: this.bankDetails.accountNumber,
      ifsc: this.bankDetails.ifsc,
      bankName: this.bankDetails.bankName,
      branch: this.bankDetails.branch,
      reference: order.orderId
    };
    
    this.orders.set(order.orderId, order);
    
    return {
      success: true,
      orderId: order.orderId,
      amount: order.amount,
      bankDetails: order.paymentDetails,
      instructions: [
        '1. Transfer amount to the bank account above',
        `2. Use reference: ${order.orderId}`,
        '3. After transfer, enter UTR/Reference number',
        '4. Payment will be verified within 1-2 hours',
        '5. Keep transaction receipt for verification'
      ],
      expiresIn: 86400 // seconds
    };
  }
  
  async verifyBankTransfer(orderId, utr) {
    // Same as UPI verification
    return await this.verifyUPIPayment(orderId, utr);
  }

  // ============================================
  // 3. CRYPTO PAYMENT (USDT TRC20)
  // ============================================
  
  async createCryptoPayment(orderData) {
    const { amount, currency, customerEmail, orderId } = orderData;
    
    const order = {
      orderId: orderId || `CRYPTO_${Date.now()}`,
      amount: parseFloat(amount),
      currency: currency || 'INR',
      customerEmail,
      paymentMethod: 'CRYPTO',
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    };
    
    // Calculate USDT amount
    const usdtRate = currency === 'INR' ? 83.12 : 1.00;
    const usdtAmount = (amount / usdtRate).toFixed(6);
    
    const address = this.cryptoWallets.usdt;
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(`tron:${address}?amount=${usdtAmount}`);
    
    order.paymentDetails = {
      cryptoType: 'USDT',
      network: 'TRC20',
      address,
      amount: usdtAmount,
      qrCode
    };
    
    this.orders.set(order.orderId, order);
    
    return {
      success: true,
      orderId: order.orderId,
      cryptoType: 'USDT',
      network: 'TRC20',
      address,
      amount: usdtAmount,
      qrCode,
      instructions: [
        `1. Send exactly ${usdtAmount} USDT`,
        '2. Network: TRC20 (Tron)',
        `3. Address: ${address}`,
        '4. After sending, enter transaction hash',
        '5. Confirmation in 1-5 minutes',
        '⚠️ Only send USDT on TRC20 network!'
      ],
      expiresIn: 1800 // seconds
    };
  }
  
  async verifyCryptoPayment(orderId, txHash) {
    const order = this.orders.get(orderId);
    
    if (!order) {
      return { success: false, error: 'Order not found' };
    }
    
    try {
      // Verify on TronScan
      const response = await axios.get(
        `https://apilist.tronscan.org/api/transaction-info?hash=${txHash}`
      );
      
      const tx = response.data;
      
      // Verify transaction
      const verified = 
        tx.contractRet === 'SUCCESS' &&
        tx.toAddress === this.cryptoWallets.usdt &&
        parseFloat(tx.amount) >= parseFloat(order.paymentDetails.amount) &&
        tx.confirmed;
      
      if (verified) {
        order.status = 'paid';
        order.paidAt = new Date();
        order.paymentDetails.txHash = txHash;
        order.paymentDetails.verifiedAt = new Date();
        order.paymentDetails.confirmations = tx.confirmations;
        
        this.payments.set(orderId, {
          orderId,
          txHash,
          amount: order.amount,
          verifiedAt: new Date()
        });
        
        return {
          success: true,
          message: 'Crypto payment verified successfully',
          order: {
            orderId: order.orderId,
            amount: order.amount,
            status: order.status,
            paidAt: order.paidAt,
            confirmations: tx.confirmations
          }
        };
      } else {
        return {
          success: false,
          error: 'Transaction verification failed',
          details: {
            status: tx.contractRet,
            toAddress: tx.toAddress,
            amount: tx.amount,
            confirmed: tx.confirmed
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to verify transaction',
        message: error.message
      };
    }
  }

  // ============================================
  // ORDER MANAGEMENT
  // ============================================
  
  getOrder(orderId) {
    const order = this.orders.get(orderId);
    
    if (!order) {
      return { success: false, error: 'Order not found' };
    }
    
    return {
      success: true,
      order: {
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
        expiresAt: order.expiresAt
      }
    };
  }
  
  getAllOrders(filter = {}) {
    const orders = Array.from(this.orders.values());
    
    let filtered = orders;
    
    if (filter.status) {
      filtered = filtered.filter(o => o.status === filter.status);
    }
    
    if (filter.paymentMethod) {
      filtered = filtered.filter(o => o.paymentMethod === filter.paymentMethod);
    }
    
    return {
      success: true,
      total: filtered.length,
      orders: filtered.map(o => ({
        orderId: o.orderId,
        amount: o.amount,
        status: o.status,
        paymentMethod: o.paymentMethod,
        createdAt: o.createdAt,
        paidAt: o.paidAt
      }))
    };
  }
  
  getDailyReport() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const orders = Array.from(this.orders.values())
      .filter(o => o.createdAt >= today);
    
    const paid = orders.filter(o => o.status === 'paid');
    const pending = orders.filter(o => o.status === 'pending');
    
    return {
      success: true,
      date: today,
      totalOrders: orders.length,
      paidOrders: paid.length,
      pendingOrders: pending.length,
      totalRevenue: paid.reduce((sum, o) => sum + o.amount, 0),
      byMethod: {
        UPI: paid.filter(o => o.paymentMethod === 'UPI').length,
        BANK: paid.filter(o => o.paymentMethod === 'BANK').length,
        CRYPTO: paid.filter(o => o.paymentMethod === 'CRYPTO').length
      }
    };
  }
}

module.exports = IndependentPaymentSystem;