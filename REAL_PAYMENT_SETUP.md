# 🚀 REAL PAYMENT SETUP - Complete Guide

## ⚡ Quick Start (5 Minutes)

### Step 1: Clone & Install
```bash
git clone https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway.git
cd ghostpay-anonymous-gateway
npm install
```

### Step 2: Setup Payment Gateways

#### 🇮🇳 **Razorpay (For UPI/INR)**

1. **Sign Up:** https://dashboard.razorpay.com/signup
2. **Get API Keys:**
   - Go to Settings → API Keys
   - Generate Test Keys (for testing)
   - Generate Live Keys (for production)
3. **Copy to .env:**
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```

**Features:**
- ✅ UPI (Google Pay, PhonePe, Paytm)
- ✅ Cards (Debit/Credit)
- ✅ Net Banking
- ✅ Wallets
- ✅ Instant settlement

**Fees:**
- 2% per transaction
- No setup fee
- No monthly fee

---

#### 🌍 **Stripe (For USD/Cards)**

1. **Sign Up:** https://dashboard.stripe.com/register
2. **Get API Keys:**
   - Go to Developers → API Keys
   - Copy Publishable Key & Secret Key
3. **Copy to .env:**
   ```
   STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
   STRIPE_SECRET_KEY=sk_test_xxxxx
   ```

**Features:**
- ✅ Credit/Debit Cards
- ✅ Apple Pay, Google Pay
- ✅ Bank Transfers
- ✅ 135+ currencies
- ✅ Global reach

**Fees:**
- 2.9% + $0.30 per transaction
- No setup fee
- No monthly fee

---

#### 💰 **Crypto Wallets (For USDT/BTC/ETH)**

1. **Create Wallets:**
   - **USDT (TRC20):** Use TronLink or Trust Wallet
   - **BTC:** Use Electrum or Ledger
   - **ETH:** Use MetaMask or MyEtherWallet

2. **Get Addresses:**
   - USDT: Starts with 'T' (TRC20)
   - BTC: Starts with '1', '3', or 'bc1'
   - ETH: Starts with '0x'

3. **Copy to .env:**
   ```
   USDT_TRC20_ADDRESS=TYourAddressHere
   BTC_ADDRESS=1YourAddressHere
   ETH_ADDRESS=0xYourAddressHere
   ```

**Features:**
- ✅ Global payments
- ✅ Low fees (TRC20: ~$1)
- ✅ Fast (1-5 minutes)
- ✅ No chargebacks

**Fees:**
- USDT (TRC20): ~$1 per transaction
- BTC: Variable ($2-$20)
- ETH: Variable ($5-$50)

---

### Step 3: Configure Environment

```bash
cp .env.example .env
nano .env  # or use any text editor
```

**Minimum Required:**
```env
# Server
PORT=3000

# Razorpay (INR/UPI)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Stripe (USD/Cards)
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx

# Crypto Wallets
USDT_TRC20_ADDRESS=TYourAddress
```

---

### Step 4: Start Server

```bash
npm start
```

**Access:**
- Main App: http://localhost:3000
- OmniPay: http://localhost:3000/omnipay.html
- GhostPay: http://localhost:3000/index.html

---

## 🧪 Testing Payments

### Test Razorpay (UPI/INR)

**Test Cards:**
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: Any future date
```

**Test UPI:**
```
UPI ID: success@razorpay
```

**Test Amounts:**
- ₹100 = Success
- ₹200 = Failure
- ₹300 = Pending

---

### Test Stripe (USD/Cards)

**Test Cards:**
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
```

**Test Details:**
```
CVV: Any 3 digits
Expiry: Any future date
ZIP: Any 5 digits
```

---

### Test Crypto (USDT)

**Testnet Faucets:**
- USDT (TRC20): https://testnet.trongrid.io/
- BTC Testnet: https://testnet-faucet.mempool.co/
- ETH Goerli: https://goerlifaucet.com/

---

## 🌐 Production Deployment

### Option 1: Vercel (Recommended)

```bash
npm install -g vercel
vercel login
vercel
```

**Add Environment Variables:**
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add all .env variables

---

### Option 2: Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

**Add Environment Variables:**
```bash
railway variables set RAZORPAY_KEY_ID=xxx
railway variables set STRIPE_SECRET_KEY=xxx
```

---

### Option 3: Heroku

```bash
heroku create omnipay-app
git push heroku main
heroku config:set RAZORPAY_KEY_ID=xxx
heroku config:set STRIPE_SECRET_KEY=xxx
```

---

## 🔒 Security Checklist

### Before Going Live:

- [ ] Switch to LIVE API keys (not test)
- [ ] Enable HTTPS/SSL
- [ ] Setup webhook endpoints
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Setup error logging
- [ ] Add fraud detection
- [ ] Implement 2FA
- [ ] Backup database
- [ ] Test all payment flows

---

## 📊 Webhook Setup

### Razorpay Webhooks

1. Go to: https://dashboard.razorpay.com/app/webhooks
2. Add Webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Select Events:
   - payment.captured
   - payment.failed
   - order.paid
4. Copy Webhook Secret to .env

---

### Stripe Webhooks

1. Go to: https://dashboard.stripe.com/webhooks
2. Add Endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select Events:
   - payment_intent.succeeded
   - payment_intent.payment_failed
   - charge.succeeded
4. Copy Signing Secret to .env

---

## 💡 Integration Examples

### HTML/JavaScript

```html
<!DOCTYPE html>
<html>
<head>
    <title>Payment Demo</title>
</head>
<body>
    <button onclick="pay()">Pay ₹500</button>

    <script>
        async function pay() {
            const response = await fetch('http://localhost:3000/api/omnipay/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: 500,
                    currency: 'INR',
                    paymentMethod: 'UPI'
                })
            });
            
            const data = await response.json();
            console.log(data);
            // Show payment UI
        }
    </script>
</body>
</html>
```

---

### React

```jsx
import { useState } from 'react';

function PaymentButton() {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        
        const response = await fetch('/api/omnipay/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: 500,
                currency: 'INR',
                paymentMethod: 'UPI'
            })
        });
        
        const data = await response.json();
        // Handle payment
        
        setLoading(false);
    };

    return (
        <button onClick={handlePayment} disabled={loading}>
            {loading ? 'Processing...' : 'Pay ₹500'}
        </button>
    );
}
```

---

### Node.js Backend

```javascript
const axios = require('axios');

async function createPayment() {
    try {
        const response = await axios.post('http://localhost:3000/api/omnipay/create', {
            amount: 500,
            currency: 'INR',
            paymentMethod: 'UPI',
            customerEmail: 'customer@example.com'
        });
        
        console.log('Payment created:', response.data);
        return response.data;
    } catch (error) {
        console.error('Payment error:', error);
    }
}
```

---

## 📈 Monitoring & Analytics

### Track These Metrics:

1. **Transaction Volume**
   - Total transactions
   - Success rate
   - Failure rate

2. **Revenue**
   - Total processed
   - By payment method
   - By currency

3. **User Behavior**
   - Preferred payment method
   - Average transaction value
   - Conversion rate

4. **Performance**
   - API response time
   - Payment success time
   - Error rates

---

## 🆘 Troubleshooting

### Common Issues:

**1. Razorpay "Invalid Key"**
```
Solution: Check if you're using test keys in test mode
and live keys in production mode
```

**2. Stripe "No such customer"**
```
Solution: Ensure customer is created before payment
```

**3. Crypto "Invalid Address"**
```
Solution: Verify address format and network
USDT TRC20 starts with 'T'
```

**4. CORS Error**
```
Solution: Add your domain to ALLOWED_ORIGINS in .env
```

---

## 📞 Support

### Get Help:

- **Documentation:** See all .md files
- **GitHub Issues:** Report bugs
- **Email:** support@omnipay.com
- **Discord:** Join community

### Razorpay Support:
- Docs: https://razorpay.com/docs/
- Support: https://razorpay.com/support/

### Stripe Support:
- Docs: https://stripe.com/docs
- Support: https://support.stripe.com/

---

## 🎉 You're Ready!

**Your real payment gateway is now set up!**

Next steps:
1. ✅ Test all payment methods
2. ✅ Deploy to production
3. ✅ Start accepting payments
4. ✅ Make it viral! (See VIRAL_STRATEGY.md)

**Good luck! 🚀**