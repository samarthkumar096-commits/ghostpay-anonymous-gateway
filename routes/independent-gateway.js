const express = require('express');
const router = express.Router();
const IndependentPaymentGateway = require('../lib/IndependentPaymentGateway');

const gateway = new IndependentPaymentGateway();

// ============================================
// MERCHANT ROUTES
// ============================================

// Register new merchant
router.post('/merchant/register', async (req, res) => {
  try {
    const result = gateway.registerMerchant(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get merchant balance
router.get('/merchant/:merchantId/balance', async (req, res) => {
  try {
    const result = gateway.getMerchantBalance(req.params.merchantId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// PAYMENT CREATION ROUTES
// ============================================

// Create UPI payment
router.post('/payment/upi/create', async (req, res) => {
  try {
    const { merchantId, amount, orderId, customerEmail, customerPhone, metadata } = req.body;
    
    const result = await gateway.createUPIPayment(merchantId, {
      amount,
      orderId,
      customerEmail,
      customerPhone,
      metadata
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create crypto payment
router.post('/payment/crypto/create', async (req, res) => {
  try {
    const { merchantId, amount, currency, cryptoType, orderId, customerEmail } = req.body;
    
    const result = await gateway.createCryptoPayment(merchantId, {
      amount,
      currency,
      cryptoType,
      orderId,
      customerEmail
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create bank transfer
router.post('/payment/bank/create', async (req, res) => {
  try {
    const { merchantId, amount, currency, orderId, customerEmail } = req.body;
    
    const result = await gateway.createBankTransfer(merchantId, {
      amount,
      currency,
      orderId,
      customerEmail
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// PAYMENT VERIFICATION ROUTES
// ============================================

// Verify payment
router.post('/payment/verify', async (req, res) => {
  try {
    const { paymentId, utr, txHash, confirmations, verified } = req.body;
    
    const result = await gateway.verifyPayment(paymentId, {
      utr,
      txHash,
      confirmations,
      verified
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get payment status
router.get('/payment/:paymentId/status', async (req, res) => {
  try {
    const result = gateway.getPaymentStatus(req.params.paymentId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// SETTLEMENT ROUTES
// ============================================

// Create settlement (payout)
router.post('/settlement/create', async (req, res) => {
  try {
    const { merchantId, amount } = req.body;
    
    const result = await gateway.createSettlement(merchantId, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// WEBHOOK ENDPOINT
// ============================================

// Receive payment confirmations
router.post('/webhook/payment', async (req, res) => {
  try {
    // Handle payment confirmation from banks/crypto networks
    const { paymentId, status, txHash, utr } = req.body;
    
    if (status === 'success') {
      await gateway.verifyPayment(paymentId, { txHash, utr, verified: true });
    }
    
    res.json({ success: true, message: 'Webhook received' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;