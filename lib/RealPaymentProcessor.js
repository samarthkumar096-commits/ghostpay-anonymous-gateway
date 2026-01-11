// ============================================
// REAL PAYMENT GATEWAY INTEGRATIONS
// ============================================

const Razorpay = require('razorpay');
const stripe = require('stripe');
const axios = require('axios');

class RealPaymentProcessor {
  constructor() {
    // Razorpay for INR/UPI (India)
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    // Stripe for USD/Cards (Global)
    this.stripe = stripe(process.env.STRIPE_SECRET_KEY);

    // Exchange rates
    this.exchangeRates = {};
    this.updateExchangeRates();
  }

  // ============================================
  // REAL-TIME EXCHANGE RATES
  // ============================================
  async updateExchangeRates() {
    try {
      // CoinGecko API for crypto rates
      const cryptoResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids: 'tether,bitcoin,ethereum',
          vs_currencies: 'usd,inr'
        }
      });

      // ExchangeRate API for fiat
      const fiatResponse = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);

      this.exchangeRates = {
        USD_TO_INR: fiatResponse.data.rates.INR,
        INR_TO_USD: 1 / fiatResponse.data.rates.INR,
        USDT_TO_USD: cryptoResponse.data.tether.usd,
        USDT_TO_INR: cryptoResponse.data.tether.inr,
        BTC_TO_USD: cryptoResponse.data.bitcoin.usd,
        BTC_TO_INR: cryptoResponse.data.bitcoin.inr,
        ETH_TO_USD: cryptoResponse.data.ethereum.usd,
        ETH_TO_INR: cryptoResponse.data.ethereum.inr
      };

      console.log('✅ Exchange rates updated:', this.exchangeRates);
    } catch (error) {
      console.error('❌ Error updating rates:', error.message);
      // Fallback rates
      this.exchangeRates = {
        USD_TO_INR: 83.12,
        INR_TO_USD: 0.012,
        USDT_TO_USD: 1.00,
        USDT_TO_INR: 83.12
      };
    }
  }

  // ============================================
  // RAZORPAY - INR/UPI PAYMENTS
  // ============================================
  async createRazorpayOrder(amount, currency = 'INR', receipt) {
    try {
      // Convert to INR if needed
      const inrAmount = currency === 'INR' ? amount : amount * this.exchangeRates.USD_TO_INR;
      
      const order = await this.razorpay.orders.create({
        amount: Math.round(inrAmount * 100), // Amount in paise
        currency: 'INR',
        receipt: receipt || `receipt_${Date.now()}`,
        payment_capture: 1,
        notes: {
          original_amount: amount,
          original_currency: currency
        }
      });

      return {
        success: true,
        orderId: order.id,
        amount: inrAmount,
        currency: 'INR',
        key: process.env.RAZORPAY_KEY_ID,
        method: 'razorpay',
        paymentMethods: ['upi', 'card', 'netbanking', 'wallet']
      };
    } catch (error) {
      throw new Error(`Razorpay error: ${error.message}`);
    }
  }

  async verifyRazorpayPayment(orderId, paymentId, signature) {
    try {
      const crypto = require('crypto');
      const text = orderId + '|' + paymentId;
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      if (generated_signature === signature) {
        // Fetch payment details
        const payment = await this.razorpay.payments.fetch(paymentId);
        
        return {
          success: true,
          verified: true,
          payment: {
            id: payment.id,
            amount: payment.amount / 100,
            currency: payment.currency,
            status: payment.status,
            method: payment.method,
            email: payment.email,
            contact: payment.contact
          }
        };
      } else {
        return {
          success: false,
          verified: false,
          error: 'Invalid signature'
        };
      }
    } catch (error) {
      throw new Error(`Verification error: ${error.message}`);
    }
  }

  // ============================================
  // STRIPE - USD/CARD PAYMENTS
  // ============================================
  async createStripePaymentIntent(amount, currency = 'USD') {
    try {
      // Convert to USD if needed
      const usdAmount = currency === 'USD' ? amount : amount * this.exchangeRates.INR_TO_USD;
      
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(usdAmount * 100), // Amount in cents
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: {
          original_amount: amount,
          original_currency: currency
        }
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: usdAmount,
        currency: 'USD',
        method: 'stripe',
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
      };
    } catch (error) {
      throw new Error(`Stripe error: ${error.message}`);
    }
  }

  async verifyStripePayment(paymentIntentId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        success: true,
        verified: paymentIntent.status === 'succeeded',
        payment: {
          id: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          method: 'card'
        }
      };
    } catch (error) {
      throw new Error(`Verification error: ${error.message}`);
    }
  }

  // ============================================
  // CRYPTO PAYMENTS (USDT/BTC/ETH)
  // ============================================
  async createCryptoPayment(amount, currency, cryptoType = 'USDT') {
    try {
      // Convert to crypto amount
      let cryptoAmount;
      const rateKey = `${cryptoType}_TO_${currency}`;
      
      if (currency === 'USD') {
        cryptoAmount = amount / this.exchangeRates[`${cryptoType}_TO_USD`];
      } else if (currency === 'INR') {
        cryptoAmount = amount / this.exchangeRates[`${cryptoType}_TO_INR`];
      } else {
        cryptoAmount = amount;
      }

      // Generate crypto address (in production, use real wallet)
      const addresses = {
        USDT: 'TXYZabc123def456ghi789jkl012mno345pqr', // TRC20
        BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        ETH: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
      };

      return {
        success: true,
        cryptoType,
        amount: cryptoAmount,
        address: addresses[cryptoType],
        network: cryptoType === 'USDT' ? 'TRC20' : cryptoType,
        qrCode: `crypto:${addresses[cryptoType]}?amount=${cryptoAmount}`,
        expiresIn: 15 * 60, // 15 minutes
        instructions: [
          `Send exactly ${cryptoAmount} ${cryptoType}`,
          `Network: ${cryptoType === 'USDT' ? 'TRC20 (Tron)' : cryptoType}`,
          'Payment will be confirmed in 1-5 minutes',
          '⚠️ Only send on correct network'
        ]
      };
    } catch (error) {
      throw new Error(`Crypto payment error: ${error.message}`);
    }
  }

  // ============================================
  // UNIFIED PAYMENT CREATION
  // ============================================
  async createPayment(data) {
    const { amount, currency, paymentMethod, customerEmail, description } = data;

    try {
      let paymentData;

      switch (paymentMethod.toUpperCase()) {
        case 'UPI':
        case 'RAZORPAY':
        case 'INR':
          paymentData = await this.createRazorpayOrder(amount, currency, description);
          break;

        case 'CARD':
        case 'STRIPE':
        case 'USD':
          paymentData = await this.createStripePaymentIntent(amount, currency);
          break;

        case 'USDT':
        case 'BTC':
        case 'ETH':
        case 'CRYPTO':
          const cryptoType = paymentMethod === 'CRYPTO' ? 'USDT' : paymentMethod;
          paymentData = await this.createCryptoPayment(amount, currency, cryptoType);
          break;

        default:
          throw new Error(`Unsupported payment method: ${paymentMethod}`);
      }

      // Add conversions
      paymentData.conversions = {
        USD: this.convertAmount(amount, currency, 'USD'),
        INR: this.convertAmount(amount, currency, 'INR'),
        USDT: this.convertAmount(amount, currency, 'USDT')
      };

      return paymentData;
    } catch (error) {
      throw error;
    }
  }

  // ============================================
  // CURRENCY CONVERSION
  // ============================================
  convertAmount(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;

    const rateKey = `${fromCurrency}_TO_${toCurrency}`;
    const rate = this.exchangeRates[rateKey];

    if (!rate) {
      // Try reverse conversion
      const reverseKey = `${toCurrency}_TO_${fromCurrency}`;
      const reverseRate = this.exchangeRates[reverseKey];
      if (reverseRate) {
        return parseFloat((amount / reverseRate).toFixed(2));
      }
      throw new Error(`Conversion not available: ${fromCurrency} to ${toCurrency}`);
    }

    return parseFloat((amount * rate).toFixed(2));
  }

  // ============================================
  // WEBHOOK HANDLERS
  // ============================================
  async handleRazorpayWebhook(payload, signature) {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(JSON.stringify(payload))
        .digest('hex');

      if (expectedSignature === signature) {
        const event = payload.event;
        const paymentEntity = payload.payload.payment.entity;

        // Handle different events
        switch (event) {
          case 'payment.captured':
            console.log('✅ Payment captured:', paymentEntity.id);
            // Update database, send confirmation email, etc.
            break;
          case 'payment.failed':
            console.log('❌ Payment failed:', paymentEntity.id);
            break;
        }

        return { success: true, event };
      } else {
        throw new Error('Invalid webhook signature');
      }
    } catch (error) {
      throw error;
    }
  }

  async handleStripeWebhook(payload, signature) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          console.log('✅ Stripe payment succeeded:', event.data.object.id);
          break;
        case 'payment_intent.payment_failed':
          console.log('❌ Stripe payment failed:', event.data.object.id);
          break;
      }

      return { success: true, event: event.type };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RealPaymentProcessor;