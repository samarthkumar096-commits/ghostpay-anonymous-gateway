# 💰 Independent Payment System

**Accept payments directly to YOUR account - Zero platform fees!**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

---

## 🎯 What is This?

A complete payment system that accepts:
- ✅ **UPI** - Direct to your UPI ID
- ✅ **Bank Transfer** - Direct to your bank account  
- ✅ **Crypto** - Direct to your wallet (USDT/BTC/ETH)

**No Razorpay. No Stripe. No third-party fees.**

---

## 💰 Cost Comparison

| Feature | Razorpay | This System |
|---------|----------|-------------|
| Transaction Fee | 2.36% | **0%** |
| Monthly Fee | ₹0 | ₹0 |
| Hosting | N/A | **₹0** |
| Settlement | T+2 days | **Instant** |

**Example:** ₹10,000 transaction
- Razorpay: You get ₹9,764 (₹236 fee)
- This system: You get ₹10,000 (₹0 fee)

**Annual savings: ₹28,320+**

---

## 🚀 Deploy (3 Minutes)

### Option 1: Render (Recommended - Free Forever)

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (free, no credit card)
3. New Web Service → Connect this repository
4. Configure:
   ```
   Runtime: Node
   Build: npm install
   Start: npm start
   Plan: FREE
   ```
5. Add environment variables (see below)
6. Deploy!

**[📖 Detailed Guide](RENDER_FREE_DEPLOY.md)**

---

### Option 2: Railway (Developer Friendly)

```bash
npm install -g @railway/cli
railway login
git clone https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway.git
cd ghostpay-anonymous-gateway
railway init
railway up
```

**[📖 Detailed Guide](RAILWAY_DEPLOYMENT.md)**

---

### Option 3: Vercel (Global CDN)

```bash
npm install -g vercel
git clone https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway.git
cd ghostpay-anonymous-gateway
vercel --prod
```

**[📖 Detailed Guide](VERCEL_DEPLOYMENT.md)**

---

## ⚙️ Environment Variables

Add these in your deployment platform:

```env
# Required
UPI_ID=yourname@paytm
BANK_ACCOUNT_NUMBER=1234567890
BANK_IFSC=SBIN0001234
BANK_ACCOUNT_NAME=Your Full Name

# Recommended
BANK_NAME=State Bank of India
BANK_BRANCH=Main Branch
NODE_ENV=production

# Optional (Crypto)
USDT_ADDRESS=TYourWalletAddress
BTC_ADDRESS=1YourBitcoinAddress
ETH_ADDRESS=0xYourEthereumAddress
```

---

## 💳 How It Works

### UPI Payment:
```
1. Customer visits your payment page
2. Enters amount (₹500)
3. Scans QR code (shows YOUR UPI ID)
4. Pays via Google Pay/PhonePe
5. Money → YOUR account (instant!)
6. Customer enters UTR
7. You verify → Order confirmed

Result: ₹500 in YOUR account (100%)
```

### Bank Transfer:
```
1. Customer selects Bank Transfer
2. Sees YOUR bank details
3. Transfers money via NEFT/IMPS
4. Money → YOUR account
5. Customer enters UTR
6. You verify → Order confirmed

Result: 100% money in YOUR account
```

### Crypto:
```
1. Customer selects Crypto
2. Sends USDT/BTC/ETH to YOUR wallet
3. Money → YOUR wallet
4. Customer enters transaction hash
5. System auto-verifies on blockchain
6. Order confirmed

Result: 100% crypto in YOUR wallet
```

---

## 📁 Project Structure

```
├── lib/
│   └── IndependentPaymentSystem.js    # Core payment logic
├── routes/
│   └── independent-system.js          # API routes
├── public/
│   └── independent.html               # Payment page
├── server.js                          # Main server
├── package.json                       # Dependencies
├── vercel.json                        # Vercel config
└── .env.example                       # Config template
```

---

## 🌐 Your URLs

After deployment:

```
Payment Page: https://your-service.onrender.com/independent.html
Health Check: https://your-service.onrender.com/health
API: https://your-service.onrender.com/api/independent/*
```

---

## 🔒 Security

- ✅ HTTPS automatic (all platforms)
- ✅ Environment variables encrypted
- ✅ UTR/TxHash uniqueness check
- ✅ Amount validation
- ✅ Rate limiting
- ✅ Order expiry (15-30 min)

---

## 📊 API Endpoints

### Create Payment
```bash
POST /api/independent/create-payment
{
  "amount": 500,
  "paymentMethod": "UPI",
  "customerEmail": "customer@example.com"
}
```

### Verify Payment
```bash
POST /api/independent/verify-payment
{
  "orderId": "ORD_123",
  "utr": "123456789012",
  "paymentMethod": "UPI"
}
```

### Get Order
```bash
GET /api/independent/order/:orderId
```

---

## 💡 Features

| Feature | Status |
|---------|--------|
| UPI Payments | ✅ |
| Bank Transfers | ✅ |
| Crypto Payments | ✅ |
| QR Code Generation | ✅ |
| Auto Crypto Verification | ✅ |
| Order Management | ✅ |
| Daily Reports | ✅ |
| Free Hosting | ✅ |

---

## 📖 Documentation

- **[START_HERE.md](START_HERE.md)** - Complete overview
- **[RENDER_FREE_DEPLOY.md](RENDER_FREE_DEPLOY.md)** - Render deployment (easiest)
- **[RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)** - Railway deployment
- **[VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)** - Vercel deployment
- **[INDEPENDENT_SYSTEM.md](INDEPENDENT_SYSTEM.md)** - Technical details
- **[SECURITY.md](SECURITY.md)** - Security guide

---

## 🎯 Perfect For

- **Freelancers** - Get paid without fees
- **Small Businesses** - Save on transaction costs
- **Content Creators** - Accept donations
- **Startups** - Bootstrap friendly
- **Anyone** - Who wants 100% of their money

---

## ⚠️ Legal

- Declare all income for taxes
- Keep transaction records
- Follow local regulations
- Issue proper invoices
- Maintain customer data securely

---

## 📄 License

MIT License - Free for commercial use

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway.git

# 2. Install
cd ghostpay-anonymous-gateway
npm install

# 3. Configure
cp .env.example .env
# Edit .env with your details

# 4. Run
npm start

# 5. Visit
http://localhost:3000/independent.html
```

---

## 💰 Start Accepting Payments

**Setup Time:** 3 minutes  
**Cost:** ₹0  
**Fees:** 0%  
**Your Money:** 100%

**Deploy now and keep 100% of your earnings!**

---

**Questions? Read [START_HERE.md](START_HERE.md)**