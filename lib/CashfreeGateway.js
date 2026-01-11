// ============================================
// REAL CASHFREE PAYMENT INTEGRATION
// Production-Ready Code
// ============================================

const { Cashfree } = require('cashfree-pg');
const crypto = require('crypto');

class CashfreePaymentGateway {
  constructor() {
    // Initialize Cashfree
    Cashfree.XClientId = process.env.CASHFREE_APP_ID;
    Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
    Cashfree.XEnvironment = process.env.NODE_ENV === 'production' 
      ? Cashfree.Environment.PRODUCTION 
      : Cashfree.Environment.SANDBOX;
  }

  // ============================================
  // CREATE ORDER
  // ============================================
  async createOrder(orderData) {
    try {
      const {
        amount,
        orderId,
        customerName,
        customerEmail,
        customerPhone,
        returnUrl,
        notifyUrl
      } = orderData;

      const request = {
        order_amount: parseFloat(amount),
        order_currency: 'INR',
        order_id: orderId || `ORDER_${Date.now()}`,
        customer_details: {
          customer_id: `CUST_${Date.now()}`,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone
        },
        order_meta: {
          return_url: returnUrl || `${process.env.FRONTEND_URL}/payment/success`,
          notify_url: notifyUrl || `${process.env.BACKEND_URL}/webhooks/cashfree`
        },
        order_note: 'Payment for order'
      };

      const response = await Cashfree.PGCreateOrder('2023-08-01', request);

      return {
        success: true,
        orderId: response.data.order_id,
        orderToken: response.data.order_token,
        paymentSessionId: response.data.payment_session_id,
        paymentLink: response.data.payment_link,
        orderStatus: response.data.order_status,
        orderAmount: response.data.order_amount
      };
    } catch (error) {
      console.error('Cashfree Create Order Error:', error);
      throw {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  // ============================================
  // GET ORDER STATUS
  // ============================================
  async getOrderStatus(orderId) {
    try {
      const response = await Cashfree.PGOrderFetchPayments('2023-08-01', orderId);

      if (response.data && response.data.length > 0) {
        const payment = response.data[0];
        
        return {
          success: true,
          orderId: payment.order_id,
          paymentStatus: payment.payment_status,
          paymentAmount: payment.payment_amount,
          paymentMethod: payment.payment_method,
          paymentTime: payment.payment_time,
          paymentId: payment.cf_payment_id,
          bankReference: payment.bank_reference
        };
      } else {
        return {
          success: false,
          error: 'No payment found for this order'
        };
      }
    } catch (error) {
      console.error('Cashfree Get Order Status Error:', error);
      throw {
        success: false,
        error: error.message
      };
    }
  }

  // ============================================
  // VERIFY WEBHOOK SIGNATURE
  // ============================================
  verifyWebhookSignature(webhookBody, signature, timestamp) {
    try {
      const signatureData = timestamp + JSON.stringify(webhookBody);
      
      const expectedSignature = crypto
        .createHmac('sha256', process.env.CASHFREE_SECRET_KEY)
        .update(signatureData)
        .digest('base64');

      return signature === expectedSignature;
    } catch (error) {
      console.error('Signature Verification Error:', error);
      return false;
    }
  }

  // ============================================
  // PROCESS WEBHOOK
  // ============================================
  async processWebhook(webhookData) {
    try {
      const { type, data } = webhookData;

      switch (type) {
        case 'PAYMENT_SUCCESS_WEBHOOK':
          return await this.handlePaymentSuccess(data);
        
        case 'PAYMENT_FAILED_WEBHOOK':
          return await this.handlePaymentFailed(data);
        
        case 'PAYMENT_USER_DROPPED_WEBHOOK':
          return await this.handlePaymentDropped(data);
        
        default:
          return {
            success: true,
            message: 'Webhook received but not processed'
          };
      }
    } catch (error) {
      console.error('Webhook Processing Error:', error);
      throw error;
    }
  }

  async handlePaymentSuccess(data) {
    const { order, payment } = data;
    
    console.log('✅ Payment Success:', {
      orderId: order.order_id,
      amount: payment.payment_amount,
      method: payment.payment_method,
      paymentId: payment.cf_payment_id
    });

    // Update your database here
    // await Order.findOneAndUpdate(
    //   { orderId: order.order_id },
    //   { 
    //     status: 'paid',
    //     paymentId: payment.cf_payment_id,
    //     paidAt: new Date()
    //   }
    // );

    // Send confirmation email/SMS
    // await sendConfirmationEmail(order.order_id);

    return {
      success: true,
      message: 'Payment success processed'
    };
  }

  async handlePaymentFailed(data) {
    const { order, payment } = data;
    
    console.log('❌ Payment Failed:', {
      orderId: order.order_id,
      reason: payment.payment_message
    });

    // Update database
    // await Order.findOneAndUpdate(
    //   { orderId: order.order_id },
    //   { status: 'failed' }
    // );

    return {
      success: true,
      message: 'Payment failure processed'
    };
  }

  async handlePaymentDropped(data) {
    const { order } = data;
    
    console.log('⚠️ Payment Dropped:', {
      orderId: order.order_id
    });

    // Update database
    // await Order.findOneAndUpdate(
    //   { orderId: order.order_id },
    //   { status: 'abandoned' }
    // );

    return {
      success: true,
      message: 'Payment drop processed'
    };
  }

  // ============================================
  // INITIATE REFUND
  // ============================================
  async initiateRefund(orderId, refundAmount, refundNote) {
    try {
      const request = {
        refund_amount: parseFloat(refundAmount),
        refund_id: `REFUND_${Date.now()}`,
        refund_note: refundNote || 'Refund initiated'
      };

      const response = await Cashfree.PGOrderCreateRefund(
        '2023-08-01',
        orderId,
        request
      );

      return {
        success: true,
        refundId: response.data.refund_id,
        refundStatus: response.data.refund_status,
        refundAmount: response.data.refund_amount,
        processedAt: response.data.processed_at
      };
    } catch (error) {
      console.error('Refund Error:', error);
      throw {
        success: false,
        error: error.message
      };
    }
  }

  // ============================================
  // GET REFUND STATUS
  // ============================================
  async getRefundStatus(orderId, refundId) {
    try {
      const response = await Cashfree.PGOrderFetchRefund(
        '2023-08-01',
        orderId,
        refundId
      );

      return {
        success: true,
        refundId: response.data.refund_id,
        refundStatus: response.data.refund_status,
        refundAmount: response.data.refund_amount,
        processedAt: response.data.processed_at
      };
    } catch (error) {
      console.error('Get Refund Status Error:', error);
      throw {
        success: false,
        error: error.message
      };
    }
  }

  // ============================================
  // GET SETTLEMENT DETAILS
  // ============================================
  async getSettlements(startDate, endDate) {
    try {
      const response = await Cashfree.PGFetchSettlements('2023-08-01', {
        start_date: startDate,
        end_date: endDate
      });

      return {
        success: true,
        settlements: response.data.map(settlement => ({
          settlementId: settlement.settlement_id,
          settlementAmount: settlement.settlement_amount,
          settlementStatus: settlement.settlement_status,
          settlementDate: settlement.settlement_date,
          utr: settlement.settlement_utr
        }))
      };
    } catch (error) {
      console.error('Get Settlements Error:', error);
      throw {
        success: false,
        error: error.message
      };
    }
  }

  // ============================================
  // PAYMENT LINK (For Email/SMS)
  // ============================================
  async createPaymentLink(linkData) {
    try {
      const {
        amount,
        customerName,
        customerEmail,
        customerPhone,
        description,
        expiryTime
      } = linkData;

      const request = {
        link_id: `LINK_${Date.now()}`,
        link_amount: parseFloat(amount),
        link_currency: 'INR',
        link_purpose: description || 'Payment',
        customer_details: {
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone
        },
        link_notify: {
          send_sms: true,
          send_email: true
        },
        link_expiry_time: expiryTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };

      const response = await Cashfree.PGCreateLink('2023-08-01', request);

      return {
        success: true,
        linkId: response.data.link_id,
        linkUrl: response.data.link_url,
        linkStatus: response.data.link_status,
        linkAmount: response.data.link_amount
      };
    } catch (error) {
      console.error('Create Payment Link Error:', error);
      throw {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = CashfreePaymentGateway;