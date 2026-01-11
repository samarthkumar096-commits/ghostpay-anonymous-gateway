# 👻 GhostPay + 💰 OmniPay - Complete Payment Solution

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)

**Two powerful payment systems in one repository!**

## 🎯 What's Inside?

### 👻 **GhostPay** - Anonymous Crypto Gateway
Fully anonymous UPI-style crypto payment system with zero bank involvement
- Ring Signatures | Stealth Addresses | Zero Knowledge Proofs

### 💰 **OmniPay** - Universal Payment Gateway  
Accept payments in USD, INR, USDT, and UPI with auto currency conversion
- Multi-Currency | Multi-Method | Global & Local

---

## 🚀 One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway)

---

## 💰 OmniPay Features

### 🌍 **Multi-Currency Support**
- 💵 **USD** - US Dollar (Cards, Bank)
- ₹ **INR** - Indian Rupees (UPI, Cards)
- ₮ **USDT** - Tether Crypto (TRC20)

### 📱 **Payment Methods**
- **UPI**: Google Pay, PhonePe, Paytm
- **Crypto**: USDT on TRC20 network
- **Cards**: Visa, Mastercard, Amex
- **Bank**: Direct transfers

### 🔄 **Auto Currency Conversion**
```
100 USD = ₹8,312 INR = 100 USDT
```

### ✨ **Perfect For:**
- 🛒 E-commerce stores
- 💼 Freelancing platforms
- 📱 Subscription services
- 🎁 Donation platforms
- 🌐 Global marketplaces

---

## 👻 GhostPay Features

### 🔐 **Privacy First**
- ✅ No KYC Required
- ✅ No Bank Involvement
- ✅ Ring Signatures (Untraceable)
- ✅ Stealth Addresses (Anonymous)
- ✅ Zero Knowledge Proofs
- ✅ Tor-Ready Architecture

### 💡 **Use Cases**
- Privacy-focused payments
- Anonymous donations
- Censorship-resistant transactions
- Personal financial freedom

---

## 🚀 Quick Start

### Installation

```bash
git clone https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway.git
cd ghostpay-anonymous-gateway
npm install
npm start
```

### Access Applications

- **OmniPay**: `http://localhost:3000/omnipay.html`
- **GhostPay**: `http://localhost:3000/index.html`

---

## 📡 OmniPay API

### Create Payment
```bash
POST /api/omnipay/create
Body: {
  "amount": 500,
  "currency": "INR",
  "paymentMethod": "UPI"
}
```

### Convert Currency
```bash
POST /api/omnipay/convert
Body: {
  "amount": 100,
  "fromCurrency": "USD",
  "toCurrency": "INR"
}
```

### Get Exchange Rates
```bash
GET /api/omnipay/rates
```

**[📖 Full OmniPay Documentation](OMNIPAY.md)**

---

## 📡 GhostPay API

### Create Anonymous Wallet
```bash
POST /api/wallet/create
```

### Send Payment
```bash
POST /api/payment/send
Body: {
  "fromWalletId": "ghost1234@privacy",
  "toAddress": "4abc...def",
  "amount": 1.5
}
```

### Generate QR Code
```bash
POST /api/payment/receive
Body: {
  "walletId": "ghost1234@privacy",
  "amount": 1.5
}
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (HTML/JS/CSS)          │
│  - OmniPay UI (Multi-Currency)          │
│  - GhostPay UI (Anonymous)              │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         Express.js Backend              │
│  - OmniPay Routes (/api/omnipay)        │
│  - GhostPay Routes (/api/wallet)        │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│         Payment Processing              │
│  - Currency Conversion                  │
│  - Payment Gateway Integration          │
│  - Transaction Management               │
└─────────────────────────────────────────┘
```

---

## 💡 Use Case Examples

### 1. **Global E-Commerce**
```javascript
// Customer in India pays ₹500
// Merchant receives $6 USD
// Auto-converted at current rate
```

### 2. **Freelance Platform**
```javascript
// Client pays 100 USDT
// Freelancer receives ₹8,312 via UPI
// Instant settlement
```

### 3. **Anonymous Donation**
```javascript
// Donor uses GhostPay
// Completely anonymous
// No identity tracking
```

---

## 🛠️ Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** Vanilla JS + Modern CSS
- **Privacy:** Ring Signatures (simulated)
- **Crypto:** Node.js crypto module
- **QR Codes:** qrcode library

---

## 📚 Documentation

- [OmniPay Guide](OMNIPAY.md) - Multi-currency payment gateway
- [Quick Start](QUICKSTART.md) - 5-minute setup guide
- [Architecture](ARCHITECTURE.md) - System design details
- [Deployment](DEPLOYMENT.md) - Deploy to Vercel/Railway/Docker
- [Security](SECURITY.md) - Security best practices

---

## 🔮 Roadmap

### OmniPay
- [ ] Razorpay integration (UPI/INR)
- [ ] Stripe integration (USD/Cards)
- [ ] Binance Pay (USDT)
- [ ] Real-time exchange rates
- [ ] Webhook support
- [ ] Payment analytics

### GhostPay
- [ ] Real Monero integration
- [ ] Tor network deployment
- [ ] Mobile app (React Native)
- [ ] Hardware wallet support
- [ ] Lightning Network

---

## ⚠️ Important Disclaimers

**EDUCATIONAL PURPOSE ONLY**

This is a prototype demonstrating payment architecture. Real-world implementation requires:

### For OmniPay:
- ✅ Real payment gateway integration (Razorpay, Stripe)
- ✅ Real exchange rate APIs
- ✅ PCI DSS compliance
- ✅ Payment gateway license
- ✅ KYC/AML compliance

### For GhostPay:
- ✅ Real Monero blockchain integration
- ✅ Security audits
- ✅ Legal compliance review
- ✅ Regulatory approval

**Legal Considerations:**
- Comply with local payment regulations
- Follow tax laws (India: 30% crypto tax, 1% TDS)
- Implement proper KYC/AML
- Use responsibly and legally

---

## 🤝 Contributing

Contributions welcome for:
- Payment gateway integrations
- Security improvements
- Documentation
- Testing
- Bug fixes

---

## 📄 License

MIT License - Use responsibly and legally

---

## 🌟 Features Comparison

| Feature | OmniPay | GhostPay |
|---------|---------|----------|
| **Currencies** | USD, INR, USDT | XMR (Monero) |
| **Methods** | UPI, Cards, Crypto | Crypto only |
| **Privacy** | Standard | Maximum |
| **KYC** | Required (production) | Never |
| **Use Case** | Business payments | Anonymous payments |
| **Conversion** | Auto | Manual |
| **Speed** | Instant | 2 minutes |

---

## 📞 Support

- **GitHub Issues**: [Report bugs](https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway/issues)
- **Documentation**: See docs folder
- **Email**: support@example.com

---

**Remember:** 
- 💰 **OmniPay** = Business & Global Payments
- 👻 **GhostPay** = Privacy & Anonymous Payments

🚀 **Choose the right tool for your needs!**

---

**Built with ❤️ for seamless global payments**