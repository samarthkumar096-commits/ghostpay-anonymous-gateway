# 💰 OmniPay - Universal Payment Gateway

**Accept payments in USD, INR, USDT, and UPI - All in one platform!**

## 🌟 What is OmniPay?

OmniPay is a **universal payment gateway** that allows you to accept payments in multiple currencies and payment methods:

- 💵 **USD** (US Dollar) - Credit/Debit Cards
- ₹ **INR** (Indian Rupees) - UPI, Cards, Net Banking
- ₮ **USDT** (Tether) - Cryptocurrency (TRC20)
- 📱 **UPI** - Google Pay, PhonePe, Paytm

## ✨ Key Features

### 🔄 **Auto Currency Conversion**
- Real-time exchange rates
- Convert between USD, INR, and USDT
- Show amounts in all currencies simultaneously

### 💳 **Multiple Payment Methods**
- **UPI**: Direct bank transfers via UPI apps
- **Crypto**: USDT on TRC20 network (low fees)
- **Cards**: Visa, Mastercard, American Express
- **Bank**: Direct bank transfers

### 🌍 **Global & Local**
- Accept international payments (USD, USDT)
- Accept local payments (INR, UPI)
- Perfect for cross-border transactions

### 🔒 **Secure & Fast**
- Instant payment confirmation
- Secure transaction processing
- QR code generation
- Payment tracking

## 🚀 Quick Start

### Installation

```bash
git clone https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway.git
cd ghostpay-anonymous-gateway
npm install
npm start
```

### Access OmniPay

Open browser: `http://localhost:3000/omnipay.html`

## 📡 API Documentation

### 1. Create Payment Request

```bash
POST /api/omnipay/create
```

**Request Body:**
```json
{
  "amount": 100,
  "currency": "INR",
  "paymentMethod": "UPI",
  "customerEmail": "customer@example.com",
  "description": "Payment for order #123"
}
```

**Response:**
```json
{
  "success": true,
  "paymentRequest": {
    "paymentId": "PAY_abc123...",
    "amount": 100,
    "currency": "INR",
    "status": "pending",
    "conversions": {
      "USD": 1.20,
      "INR": 100,
      "USDT": 1.20
    }
  },
  "paymentDetails": {
    "method": "UPI",
    "upiId": "merchant@paytm",
    "qrCode": "data:image/png;base64,...",
    "instructions": [...]
  }
}
```

### 2. Convert Currency

```bash
POST /api/omnipay/convert
```

**Request Body:**
```json
{
  "amount": 100,
  "fromCurrency": "USD",
  "toCurrency": "INR"
}
```

**Response:**
```json
{
  "success": true,
  "original": {
    "amount": 100,
    "currency": "USD"
  },
  "converted": {
    "amount": 8312,
    "currency": "INR"
  },
  "rate": 83.12
}
```

### 3. Get Exchange Rates

```bash
GET /api/omnipay/rates
```

**Response:**
```json
{
  "success": true,
  "rates": {
    "USD_TO_INR": 83.12,
    "USDT_TO_USD": 1.00,
    "USDT_TO_INR": 83.12,
    "INR_TO_USD": 0.012,
    "INR_TO_USDT": 0.012
  },
  "supportedCurrencies": ["USD", "INR", "USDT"],
  "supportedMethods": ["UPI", "CRYPTO", "CARD", "BANK"]
}
```

### 4. Verify Payment

```bash
POST /api/omnipay/verify
```

**Request Body:**
```json
{
  "paymentId": "PAY_abc123...",
  "transactionHash": "0x123abc..."
}
```

## 💡 Use Cases

### 1. **E-Commerce Store**
Accept payments from customers worldwide:
- Indian customers pay via UPI (₹)
- International customers pay via Card (USD)
- Crypto enthusiasts pay via USDT

### 2. **Freelancing Platform**
Receive payments in your preferred currency:
- Client pays in USD
- You receive in INR via UPI
- Auto-conversion handled

### 3. **Subscription Service**
Flexible payment options:
- Monthly: ₹499 or $6 or 6 USDT
- Customers choose their preferred method

### 4. **Donation Platform**
Accept donations globally:
- UPI for Indian donors
- USDT for crypto donors
- Cards for international donors

## 🔄 Currency Conversion Examples

```javascript
// Example 1: USD to INR
100 USD = ₹8,312 INR

// Example 2: USDT to INR
50 USDT = ₹4,156 INR

// Example 3: INR to USD
₹1,000 INR = $12.03 USD
```

## 📱 Payment Methods

### UPI (India)
- **Apps**: Google Pay, PhonePe, Paytm, BHIM
- **Speed**: Instant
- **Fees**: Zero
- **Limit**: ₹1,00,000 per transaction

### USDT (Crypto)
- **Network**: TRC20 (Tron)
- **Speed**: 1-2 minutes
- **Fees**: ~$1
- **Limit**: No limit

### Cards (Global)
- **Types**: Visa, Mastercard, Amex
- **Speed**: Instant
- **Fees**: 2-3%
- **Limit**: Varies by card

## 🛡️ Security Features

- ✅ Secure payment processing
- ✅ Encrypted transactions
- ✅ QR code generation
- ✅ Payment verification
- ✅ Transaction tracking
- ✅ Fraud prevention

## 🌐 Integration Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

async function createPayment() {
  const response = await axios.post('http://localhost:3000/api/omnipay/create', {
    amount: 500,
    currency: 'INR',
    paymentMethod: 'UPI',
    customerEmail: 'customer@example.com'
  });
  
  console.log(response.data);
}
```

### Python

```python
import requests

def create_payment():
    response = requests.post('http://localhost:3000/api/omnipay/create', json={
        'amount': 500,
        'currency': 'INR',
        'paymentMethod': 'UPI',
        'customerEmail': 'customer@example.com'
    })
    
    print(response.json())
```

### cURL

```bash
curl -X POST http://localhost:3000/api/omnipay/create \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500,
    "currency": "INR",
    "paymentMethod": "UPI",
    "customerEmail": "customer@example.com"
  }'
```

## 📊 Supported Currencies

| Currency | Symbol | Code | Min Amount | Max Amount |
|----------|--------|------|------------|------------|
| US Dollar | $ | USD | $1 | $10,000 |
| Indian Rupee | ₹ | INR | ₹10 | ₹1,00,000 |
| Tether | ₮ | USDT | 1 USDT | 10,000 USDT |

## 🔮 Roadmap

- [ ] Real-time exchange rate API integration
- [ ] Razorpay integration for UPI
- [ ] Stripe integration for cards
- [ ] Binance Pay for crypto
- [ ] Webhook support
- [ ] Payment analytics dashboard
- [ ] Multi-language support
- [ ] Mobile SDK

## ⚠️ Important Notes

**This is an educational prototype.** For production use:

1. **Integrate Real Payment Gateways:**
   - Razorpay for UPI/INR
   - Stripe for USD/Cards
   - Binance/Coinbase for USDT

2. **Use Real Exchange Rate APIs:**
   - CoinGecko API
   - ExchangeRate-API
   - Fixer.io

3. **Implement Security:**
   - SSL/TLS certificates
   - Payment encryption
   - Fraud detection
   - PCI DSS compliance

4. **Legal Compliance:**
   - Payment gateway license
   - KYC/AML compliance
   - Tax regulations
   - Terms of service

## 📄 License

MIT License - Use responsibly and legally

---

**Built with ❤️ for seamless global payments**

🌍 **Accept payments from anywhere, in any currency!**