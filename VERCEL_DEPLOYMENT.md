# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel (2 Minutes)

### Method 1: One-Click Deploy (Easiest)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway)

1. Click the button above
2. Sign in to Vercel (free account)
3. Import the repository
4. Add environment variables (see below)
5. Click "Deploy"
6. Done! Your payment system is live! 🎉

---

### Method 2: Vercel CLI (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy
```bash
# From your project directory
cd ghostpay-anonymous-gateway

# Deploy to production
vercel --prod
```

#### Step 4: Add Environment Variables
```bash
# Add your payment details
vercel env add UPI_ID
vercel env add BANK_ACCOUNT_NUMBER
vercel env add BANK_IFSC
vercel env add BANK_ACCOUNT_NAME
vercel env add BANK_NAME
vercel env add BANK_BRANCH
vercel env add USDT_ADDRESS
```

Or add via Vercel Dashboard:
1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add all variables from `.env.example`

---

### Method 3: GitHub Integration (Auto Deploy)

#### Step 1: Connect GitHub
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select `ghostpay-anonymous-gateway`

#### Step 2: Configure
```
Framework Preset: Other
Build Command: (leave empty)
Output Directory: public
Install Command: npm install
```

#### Step 3: Environment Variables
Add these in Vercel dashboard:

```env
# Required
UPI_ID=yourname@paytm
BANK_ACCOUNT_NUMBER=1234567890
BANK_IFSC=SBIN0001234
BANK_ACCOUNT_NAME=Your Name
BANK_NAME=State Bank of India
BANK_BRANCH=Main Branch

# Optional
USDT_ADDRESS=TYourWalletAddress
BTC_ADDRESS=1YourBitcoinAddress
ETH_ADDRESS=0xYourEthereumAddress

# Business Details
BUSINESS_NAME=Your Business
BUSINESS_EMAIL=business@example.com
BUSINESS_PHONE=+91-9876543210

# Security
JWT_SECRET=your-super-secret-key
SESSION_SECRET=your-session-secret

# Limits
MIN_PAYMENT_AMOUNT=10
MAX_PAYMENT_AMOUNT=100000

# Crypto Rates
USDT_TO_INR=83.12
```

#### Step 4: Deploy
Click "Deploy" and wait 1-2 minutes!

---

## 🌐 Your Live URLs

After deployment, you'll get:

```
Main URL: https://your-project.vercel.app

Payment Pages:
├─ Independent System: /independent.html
├─ PayX Gateway:       /payx.html
├─ OmniPay:           /omnipay.html
└─ GhostPay:          /index.html

API Endpoints:
├─ /api/independent/*
├─ /api/gateway/*
├─ /api/production/*
└─ /api/omnipay/*
```

---

## ⚙️ Vercel Configuration

The `vercel.json` file is already configured:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    },
    {
      "src": "/(.*)",
      "dest": "public/$1"
    }
  ]
}
```

---

## 🔒 Security Setup

### 1. Add Environment Variables
Never commit sensitive data! Add via Vercel dashboard:
- UPI ID
- Bank details
- Crypto addresses
- API keys
- Secrets

### 2. Enable HTTPS
Vercel automatically provides HTTPS for all deployments.

### 3. Custom Domain (Optional)
```bash
# Add your domain
vercel domains add yourdomain.com

# Configure DNS
# Add CNAME record: yourdomain.com → cname.vercel-dns.com
```

---

## 📊 Monitoring

### View Logs
```bash
vercel logs
```

### View Deployments
```bash
vercel ls
```

### View Project Info
```bash
vercel inspect
```

---

## 🔄 Auto Deployments

Once connected to GitHub:
- ✅ Push to `main` → Auto deploy to production
- ✅ Push to other branches → Preview deployments
- ✅ Pull requests → Preview URLs

---

## 💰 Pricing

### Vercel Free Tier (Perfect for this project):
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Serverless functions
- ✅ Edge network

**Cost: ₹0/month** 🎉

---

## 🚀 Post-Deployment Steps

### 1. Test Your Payment System
```bash
# Visit your live URL
https://your-project.vercel.app/independent.html

# Test UPI payment
# Test Bank transfer
# Test Crypto payment
```

### 2. Update Your Business
- Add live URL to your website
- Share with customers
- Start accepting payments!

### 3. Monitor Payments
```bash
# Check daily report
https://your-project.vercel.app/api/independent/report/daily

# Check orders
https://your-project.vercel.app/api/independent/orders
```

---

## 🔧 Troubleshooting

### Issue: Environment variables not working
**Solution:**
```bash
# Re-add environment variables
vercel env pull
vercel --prod
```

### Issue: API routes not working
**Solution:**
Check `vercel.json` routes configuration

### Issue: Static files not loading
**Solution:**
Ensure files are in `public/` directory

### Issue: Build fails
**Solution:**
```bash
# Check logs
vercel logs

# Redeploy
vercel --prod --force
```

---

## 📱 Mobile App Integration

Your Vercel URL can be used in mobile apps:

```javascript
// React Native / Flutter
const API_URL = 'https://your-project.vercel.app';

// Create payment
fetch(`${API_URL}/api/independent/create-payment`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 500,
    paymentMethod: 'UPI',
    customerEmail: 'customer@example.com'
  })
});
```

---

## 🌍 Custom Domain Setup

### Step 1: Add Domain in Vercel
```bash
vercel domains add yourdomain.com
```

### Step 2: Configure DNS
Add these records in your domain provider:

**For root domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Wait for DNS Propagation
Usually takes 5-30 minutes.

### Step 4: Enable HTTPS
Vercel automatically provisions SSL certificate.

---

## 📈 Performance Optimization

### 1. Enable Edge Caching
Already configured in `vercel.json`

### 2. Optimize Images
```bash
# Use Vercel Image Optimization
https://your-project.vercel.app/_next/image?url=/image.jpg&w=640&q=75
```

### 3. Monitor Performance
- Vercel Analytics (free)
- Real-time metrics
- Performance insights

---

## 🎯 Production Checklist

Before going live:

- [ ] Add all environment variables
- [ ] Test UPI payments
- [ ] Test Bank transfers
- [ ] Test Crypto payments
- [ ] Verify payment verification works
- [ ] Test on mobile devices
- [ ] Add custom domain (optional)
- [ ] Enable monitoring
- [ ] Test error handling
- [ ] Backup payment data

---

## 💡 Tips

### 1. Use Preview Deployments
```bash
# Deploy to preview URL
vercel

# Test before production
# Then promote to production
vercel --prod
```

### 2. Environment-Specific Variables
```bash
# Development
vercel env add UPI_ID development

# Production
vercel env add UPI_ID production
```

### 3. Rollback if Needed
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

---

## 🆘 Support

### Vercel Support
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord
- GitHub: https://github.com/vercel/vercel

### Project Support
- GitHub Issues: https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway/issues
- Email: support@yourdomain.com

---

## 🎉 Success!

Your independent payment system is now live on Vercel!

**Live URL:** https://your-project.vercel.app/independent.html

**Features:**
- ✅ Zero platform fees
- ✅ Direct UPI payments
- ✅ Direct bank transfers
- ✅ Direct crypto payments
- ✅ 100% your control
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Auto deployments

**Start accepting payments with 0% fees!** 🚀💰