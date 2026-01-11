const express = require('express');
const router = express.Router();
const CashfreeGateway = require('../lib/CashfreeGateway');

const cashfree = new CashfreeGateway();

// ============================================
// CREATE ORDER
// ============================================
router.post('/create-order', async (req, res) => {
  try {
    const {
      amount,
      customerName,
      customerEmail,
      customerPhone,
      orderId
    } = req.body;

    // Validation
    if (!amount || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await cashfree.createOrder({
      amount,
      orderId,
      customerName: customerName || 'Customer',
      customerEmail,
      customerPhone,
      returnUrl: `${process.env.FRONTEND_URL}/payment/success`,
      notifyUrl: `${process.env.BACKEND_URL}/api/production/webhooks/cashfree`
    });

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
router.get('/order-status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await cashfree.getOrderStatus(orderId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// WEBHOOK HANDLER
// ============================================
router.post('/webhooks/cashfree', async (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];

    // Verify signature
    const isValid = cashfree.verifyWebhookSignature(
      req.body,
      signature,
      timestamp
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid webhook signature'
      });
    }

    // Process webhook
    const result = await cashfree.processWebhook(req.body);
    
    res.json(result);
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// INITIATE REFUND
// ============================================
router.post('/refund', async (req, res) => {
  try {
    const { orderId, refundAmount, refundNote } = req.body;

    if (!orderId || !refundAmount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await cashfree.initiateRefund(
      orderId,
      refundAmount,
      refundNote
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// GET REFUND STATUS
// ============================================
router.get('/refund-status/:orderId/:refundId', async (req, res) => {
  try {
    const { orderId, refundId } = req.params;
    const result = await cashfree.getRefundStatus(orderId, refundId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// CREATE PAYMENT LINK
// ============================================
router.post('/create-payment-link', async (req, res) => {
  try {
    const {
      amount,
      customerName,
      customerEmail,
      customerPhone,
      description,
      expiryTime
    } = req.body;

    if (!amount || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await cashfree.createPaymentLink({
      amount,
      customerName,
      customerEmail,
      customerPhone,
      description,
      expiryTime
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// GET SETTLEMENTS
// ============================================
router.get('/settlements', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date and end date are required'
      });
    }

    const result = await cashfree.getSettlements(startDate, endDate);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;