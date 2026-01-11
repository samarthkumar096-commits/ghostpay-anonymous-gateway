# 🚂 Railway Deployment Guide - Easiest Way!

## 🎯 Why Railway?

- ✅ **Easier than Vercel** - No complex configuration
- ✅ **Better for APIs** - Perfect for payment systems
- ✅ **Free $5 credit** - Enough for months
- ✅ **Auto HTTPS** - Secure by default
- ✅ **One command deploy** - Super simple
- ✅ **Real-time logs** - Easy debugging

---

## 🚀 Method 1: Railway CLI (Recommended - 2 Minutes)

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```
Browser will open → Click "Authorize"

### Step 3: Clone & Deploy
```bash
# Clone repository
git clone https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway.git
cd ghostpay-anonymous-gateway

# Initialize Railway project
railway init

# Deploy!
railway up
```

### Step 4: Add Environment Variables
```bash
# Add your payment details
railway variables set UPI_ID=yourname@paytm
railway variables set BANK_ACCOUNT_NUMBER=1234567890
railway variables set BANK_IFSC=SBIN0001234
railway variables set BANK_ACCOUNT_NAME="Your Full Name"
railway variables set BANK_NAME="State Bank of India"
railway variables set BANK_BRANCH="Main Branch"
railway variables set USDT_ADDRESS=TYourWalletAddress
```

### Step 5: Get Your Live URL
```bash
railway domain
```

**Done! Your payment system is live!** 🎉

---

## 🚀 Method 2: Railway Dashboard (No CLI Needed)

### Step 1: Go to Railway
```
https://railway.app
```

### Step 2: Sign Up/Login
- Click "Login with GitHub"
- Authorize Railway

### Step 3: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: `samarthkumar096-commits/ghostpay-anonymous-gateway`
4. Click **"Deploy Now"**

### Step 4: Add Environment Variables
1. Click on your project
2. Go to **"Variables"** tab
3. Click **"New Variable"**
4. Add these one by one:

```env
UPI_ID=yourname@paytm
BANK_ACCOUNT_NUMBER=1234567890
BANK_IFSC=SBIN0001234
BANK_ACCOUNT_NAME=Your Full Name
BANK_NAME=State Bank of India
BANK_BRANCH=Main Branch
USDT_ADDRESS=TYourWalletAddress
BTC_ADDRESS=1YourBitcoinAddress
ETH_ADDRESS=0xYourEthereumAddress
```

### Step 5: Generate Domain
1. Go to **"Settings"** tab
2. Click **"Generate Domain"**
3. Copy your URL: `https://your-project.up.railway.app`

**Done! Live in 2 minutes!** 🎉

---

## 🌐 Your Live URLs

After deployment:

```
Main URL: https://your-project.up.railway.app

Payment Pages:
├─ Independent System: /independent.html
├─ PayX Gateway:       /payx.html
├─ OmniPay:           /omnipay.html
└─ GhostPay:          /index.html

API Endpoints:
├─ /api/independent/*
├─ /api/gateway/*
├─ /api/production/*
└─ /health
```

---

## 💰 Railway Pricing

### Free Tier:
- ✅ **$5 free credit** (monthly)
- ✅ **500 hours** execution time
- ✅ **100GB bandwidth**
- ✅ **1GB RAM**
- ✅ **1GB storage**

**Perfect for payment system!** Most users stay free forever! 🎉

### If You Need More:
- **Hobby Plan:** $5/month
- **Pro Plan:** $20/month

---

## 📊 Railway Configuration

Railway automatically detects:
- ✅ `package.json` → Installs dependencies
- ✅ `server.js` → Runs your app
- ✅ Port from `process.env.PORT`
- ✅ Node.js version

**No configuration file needed!** 🎯

---

## 🔧 Useful Railway Commands

### View Logs
```bash
railway logs
```

### Open Dashboard
```bash
railway open
```

### Check Status
```bash
railway status
```

### Redeploy
```bash
railway up --detach
```

### Add More Variables
```bash
railway variables set KEY=value
```

### Get Domain
```bash
railway domain
```

---

## 🎯 Post-Deployment Steps

### 1. Test Your Payment System
```bash
# Visit your live URL
https://your-project.up.railway.app/independent.html

# Test UPI payment
# Test Bank transfer
# Test Crypto payment
```

### 2. Check Health
```bash
curl https://your-project.up.railway.app/health
```

Expected response:
```json
{
  "status": "online",
  "environment": "production",
  "features": [
    "GhostPay (Anonymous)",
    "OmniPay (Multi-currency)",
    "PayX (Independent Gateway)",
    "Independent System (100% Your Control)"
  ]
}
```

### 3. Monitor Logs
```bash
railway logs --follow
```

---

## 🔒 Security Setup

### 1. Environment Variables
All sensitive data is encrypted by Railway automatically.

### 2. HTTPS
Railway provides automatic HTTPS for all deployments.

### 3. Custom Domain (Optional)
```bash
# Add your domain
railway domain add yourdomain.com
```

Then add DNS record:
```
Type: CNAME
Name: @
Value: your-project.up.railway.app
```

---

## 📱 Real Payment Testing

### Test UPI Payment:
1. Go to: `https://your-project.up.railway.app/independent.html`
2. Enter amount: ₹100
3. Select UPI
4. QR code will show YOUR UPI ID
5. Scan with any UPI app
6. Pay ₹100
7. Money goes to YOUR account! 💰

### Test Bank Transfer:
1. Select "Bank Transfer"
2. Your bank details will show
3. Customer transfers money
4. Money goes to YOUR account! 💰

### Test Crypto:
1. Select "Crypto (USDT)"
2. Your wallet address shows
3. Customer sends USDT
4. Money goes to YOUR wallet! 💰

---

## 🔄 Auto Deployments

Railway automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update payment system"
git push origin main

# Railway automatically deploys! 🚀
```

---

## 🆘 Troubleshooting

### Issue: "Build failed"
**Solution:**
```bash
# Check logs
railway logs

# Redeploy
railway up --detach
```

### Issue: "Environment variables not working"
**Solution:**
```bash
# List variables
railway variables

# Add missing ones
railway variables set KEY=value

# Restart
railway restart
```

### Issue: "Port already in use"
**Solution:**
Railway automatically assigns port. Make sure your `server.js` uses:
```javascript
const PORT = process.env.PORT || 3000;
```

### Issue: "Cannot connect to database"
**Solution:**
Add database in Railway dashboard:
1. Click "New"
2. Select "Database" → "PostgreSQL" or "MongoDB"
3. Connect to your app

---

## 💡 Pro Tips

### 1. View Real-Time Logs
```bash
railway logs --follow
```

### 2. Connect to Shell
```bash
railway shell
```

### 3. Run Commands
```bash
railway run npm install
railway run node script.js
```

### 4. Multiple Environments
```bash
# Create staging environment
railway environment create staging

# Switch environment
railway environment use staging
```

### 5. Backup Data
```bash
# Export environment variables
railway variables > backup.env
```

---

## 📊 Monitoring

### Railway Dashboard Shows:
- ✅ CPU usage
- ✅ Memory usage
- ✅ Network traffic
- ✅ Request logs
- ✅ Error logs
- ✅ Deployment history

### Set Up Alerts:
1. Go to Settings
2. Enable "Deployment Notifications"
3. Add webhook URL (optional)

---

## 🎯 Production Checklist

Before going live:

- [ ] All environment variables added
- [ ] Test UPI payments
- [ ] Test Bank transfers
- [ ] Test Crypto payments
- [ ] Check logs for errors
- [ ] Test on mobile devices
- [ ] Add custom domain (optional)
- [ ] Set up monitoring
- [ ] Backup environment variables

---

## 💰 Cost Estimation

### For Payment System:

**Free Tier ($5 credit):**
- Handles: ~10,000 requests/month
- Perfect for: Small business, freelancers
- Cost: **₹0/month**

**Hobby Plan ($5/month):**
- Handles: ~100,000 requests/month
- Perfect for: Growing business
- Cost: **₹415/month**

**Still cheaper than Razorpay fees!**

Example:
```
Monthly sales: ₹1,00,000
Razorpay fees: ₹2,360
Railway cost: ₹0 (free tier)
You save: ₹2,360/month = ₹28,320/year!
```

---

## 🔗 Useful Links

- **Railway Dashboard:** https://railway.app/dashboard
- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Railway Status:** https://status.railway.app

---

## 🎉 Success!

Your independent payment system is now live on Railway!

**Live URL:** `https://your-project.up.railway.app/independent.html`

**Features:**
- ✅ Zero platform fees
- ✅ Direct UPI payments
- ✅ Direct bank transfers
- ✅ Direct crypto payments
- ✅ 100% your control
- ✅ Auto HTTPS
- ✅ Real-time logs
- ✅ Auto deployments

**Start accepting payments with 0% fees!** 🚀💰

---

## 📞 Need Help?

**Railway Support:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Twitter: @Railway

**Project Support:**
- GitHub: https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway/issues

---

## ✅ Quick Start Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Clone & Deploy
git clone https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway.git
cd ghostpay-anonymous-gateway
railway init
railway up

# Add environment variables
railway variables set UPI_ID=yourname@paytm
railway variables set BANK_ACCOUNT_NUMBER=1234567890
railway variables set BANK_IFSC=SBIN0001234

# Get your URL
railway domain

# View logs
railway logs --follow
```

**That's it! You're live!** 🎉