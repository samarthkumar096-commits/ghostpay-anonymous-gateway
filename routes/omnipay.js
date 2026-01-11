const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Currency conversion rates (real-time API integration recommended)
const EXCHANGE_RATES = {
  'USD_TO_INR': 83.12,
  'USDT_TO_USD': 1.00,
  'USDT_TO_INR': 83.12,
  'INR_TO_USD': 0.012,
  'INR_TO_USDT': 0.012
};

// ============================================
// MULTI-CURRENCY PAYMENT PROCESSOR
// ============================================

class OmniPayProcessor {
  constructor() {
    this.supportedCurrencies = ['USD', 'INR', 'USDT'];
    this.supportedMethods = ['UPI', 'CRYPTO', 'CARD', 'BANK'];
  }

  // Convert between currencies
  convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;
    
    const conversionKey = `${fromCurrency}_TO_${toCurrency}`;
    const rate = EXCHANGE_RATES[conversionKey];
    
    if (!rate) {
      throw new Error(`Conversion not supported: ${fromCurrency} to ${toCurrency}`);
    }
    
    return parseFloat((amount * rate).toFixed(2));
  }

  // Generate payment request
  generatePaymentRequest(data) {
    const {
      amount,
      currency,
      paymentMethod,
      customerEmail,
      description
    } = data;

    const paymentId = 'PAY_' + crypto.randomBytes(16).toString('hex');
    
    return {
      paymentId,
      amount,
      currency,
      paymentMethod,
      customerEmail,
      description,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      conversions: this.getConversions(amount, currency)
    };
  }

  // Get all currency conversions
  getConversions(amount, fromCurrency) {
    const conversions = {};
    
    this.supportedCurrencies.forEach(toCurrency => {
      try {
        conversions[toCurrency] = this.convertCurrency(amount, fromCurrency, toCurrency);
      } catch (error) {
        conversions[toCurrency] = null;
      }
    });
    
    return conversions;
  }

  // Generate UPI payment details
  generateUPIPayment(amount, currency) {
    // Convert to INR if needed
    const inrAmount = currency === 'INR' ? amount : this.convertCurrency(amount, currency, 'INR');
    
    return {
      method: 'UPI',
      upiId: 'merchant@paytm',
      amount: inrAmount,
      currency: 'INR',
      qrCode: this.generateUPIQR(inrAmount),
      instructions: [
        'Open any UPI app (Google Pay, PhonePe, Paytm)',
        'Scan the QR code',
        `Pay ₹${inrAmount}`,
        'Payment will be confirmed automatically'
      ]
    };
  }

  // Generate USDT payment details
  generateUSDTPayment(amount, currency) {
    // Convert to USDT if needed
    const usdtAmount = currency === 'USDT' ? amount : this.convertCurrency(amount, currency, 'USDT');
    
    return {
      method: 'USDT',
      network: 'TRC20', // Tron network (lowest fees)
      address: 'TXYZabc123def456ghi789jkl012mno345pqr',
      amount: usdtAmount,
      currency: 'USDT',
      qrCode: this.generateCryptoQR('TXYZabc123def456ghi789jkl012mno345pqr', usdtAmount),
      instructions: [
        'Open your crypto wallet (Trust Wallet, MetaMask, Binance)',
        'Select USDT (TRC20 network)',
        'Scan QR or copy address',
        `Send exactly ${usdtAmount} USDT`,
        'Transaction will be confirmed in 1-2 minutes'
      ],
      warning: '⚠️ Only send USDT on TRC20 network. Other networks will result in loss of funds.'
    };
  }

  // Generate USD card payment details
  generateUSDPayment(amount, currency) {
    // Convert to USD if needed
    const usdAmount = currency === 'USD' ? amount : this.convertCurrency(amount, currency, 'USD');
    
    return {
      method: 'CARD',
      amount: usdAmount,
      currency: 'USD',
      provider: 'Stripe',
      instructions: [
        'Enter your card details',
        'Card will be charged in USD',
        'International cards accepted',
        'Secure 3D authentication'
      ]
    };
  }

  generateUPIQR(amount) {
    // Simplified UPI QR format
    const upiString = `upi://pay?pa=merchant@paytm&pn=OmniPay&am=${amount}&cu=INR`;
    return `data:image/png;base64,${Buffer.from(upiString).toString('base64')}`;
  }

  generateCryptoQR(address, amount) {
    const cryptoString = `tron:${address}?amount=${amount}`;
    return `data:image/png;base64,${Buffer.from(cryptoString).toString('base64')}`;
  }
}

// ============================================
// API ROUTES
// ============================================

const processor = new OmniPayProcessor();

// Create payment request
router.post('/create', async (req, res) => {
  try {
    const {
      amount,
      currency,
      paymentMethod,
      customerEmail,
      description
    } = req.body;

    // Validate input
    if (!amount || !currency || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: amount, currency, paymentMethod'
      });
    }

    if (!processor.supportedCurrencies.includes(currency)) {
      return res.status(400).json({
        success: false,
        error: `Currency not supported. Supported: ${processor.supportedCurrencies.join(', ')}`
      });
    }

    // Generate payment request
    const paymentRequest = processor.generatePaymentRequest({
      amount,
      currency,
      paymentMethod,
      customerEmail,
      description
    });

    // Generate payment details based on method
    let paymentDetails;
    
    switch (paymentMethod.toUpperCase()) {
      case 'UPI':
        paymentDetails = processor.generateUPIPayment(amount, currency);
        break;
      case 'USDT':
      case 'CRYPTO':
        paymentDetails = processor.generateUSDTPayment(amount, currency);
        break;
      case 'USD':
      case 'CARD':
        paymentDetails = processor.generateUSDPayment(amount, currency);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: `Payment method not supported: ${paymentMethod}`
        });
    }

    res.json({
      success: true,
      paymentRequest,
      paymentDetails,
      message: 'Payment request created successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Convert currency
router.post('/convert', (req, res) => {
  try {
    const { amount, fromCurrency, toCurrency } = req.body;

    if (!amount || !fromCurrency || !toCurrency) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: amount, fromCurrency, toCurrency'
      });
    }

    const convertedAmount = processor.convertCurrency(amount, fromCurrency, toCurrency);

    res.json({
      success: true,
      original: {
        amount,
        currency: fromCurrency
      },
      converted: {
        amount: convertedAmount,
        currency: toCurrency
      },
      rate: EXCHANGE_RATES[`${fromCurrency}_TO_${toCurrency}`]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get exchange rates
router.get('/rates', (req, res) => {
  res.json({
    success: true,
    rates: EXCHANGE_RATES,
    supportedCurrencies: processor.supportedCurrencies,
    supportedMethods: processor.supportedMethods,
    lastUpdated: new Date()
  });
});

// Verify payment (webhook simulation)
router.post('/verify', async (req, res) => {
  try {
    const { paymentId, transactionHash } = req.body;

    // Simulate payment verification
    // In production, verify with actual payment provider
    
    res.json({
      success: true,
      paymentId,
      status: 'confirmed',
      transactionHash,
      confirmedAt: new Date(),
      message: 'Payment verified successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;