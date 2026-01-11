const express = require('express');
const router = express.Router();
const IndependentPaymentSystem = require('../lib/IndependentPaymentSystem');

// Initialize payment system with your details
const paymentSystem = new IndependentPaymentSystem({
  upiId: process.env.UPI_ID || 'yourname@paytm',
  bankDetails: {
    accountName: process.env.BANK_ACCOUNT_NAME || 'Your Name',
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || '1234567890',
    ifsc: process.env.BANK_IFSC || 'SBIN0001234',
    bankName: process.env.BANK_NAME || 'State Bank of India',
    branch: process.env.BANK_BRANCH || 'Main Branch'
  },
  cryptoWallets: {
    usdt: process.env.USDT_ADDRESS || 'TYourWalletAddress',
    btc: process.env.BTC_ADDRESS || '1YourBitcoinAddress',
    eth: process.env.ETH_ADDRESS || '0xYourEthereumAddress'
  }
});

// ============================================
// CREATE PAYMENT
// ============================================

router.post('/create-payment', async (req, res) => {
  try {
    const { amount, paymentMethod, customerEmail, customerPhone, currency } = req.body;

    if (!amount || !paymentMethod || !customerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    let result;

    switch (paymentMethod) {
      case 'UPI':
        result = await paymentSystem.createUPIPayment({
          amount,
          customerEmail,
          customerPhone
        });
        break;

      case 'BANK':
        result = await paymentSystem.createBankTransfer({
          amount,
          customerEmail,
          customerPhone
        });
        break;

      case 'CRYPTO':
        result = await paymentSystem.createCryptoPayment({
          amount,
          currency: currency || 'INR',
          customerEmail
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid payment method'
        });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// VERIFY PAYMENT
// ============================================

router.post('/verify-payment', async (req, res) => {
  try {
    const { orderId, utr, txHash, paymentMethod } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'Order ID is required'
      });
    }

    let result;

    if (paymentMethod === 'UPI' || paymentMethod === 'BANK') {
      if (!utr) {
        return res.status(400).json({
          success: false,
          error: 'UTR is required'
        });
      }
      result = await paymentSystem.verifyUPIPayment(orderId, utr);
    } else if (paymentMethod === 'CRYPTO') {
      if (!txHash) {
        return res.status(400).json({
          success: false,
          error: 'Transaction hash is required'
        });
      }
      result = await paymentSystem.verifyCryptoPayment(orderId, txHash);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment method'
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// GET ORDER STATUS
// ============================================

router.get('/order/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const result = paymentSystem.getOrder(orderId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// GET ALL ORDERS
// ============================================

router.get('/orders', (req, res) => {
  try {
    const { status, paymentMethod } = req.query;
    const result = paymentSystem.getAllOrders({ status, paymentMethod });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// DAILY REPORT
// ============================================

router.get('/report/daily', (req, res) => {
  try {
    const result = paymentSystem.getDailyReport();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;