# 🎨 Render Free Deployment - Complete Setup

## ✅ Step-by-Step Free Deployment

### Step 1: Go to Render
Open: https://render.com

### Step 2: Sign Up (Free - No Credit Card)
1. Click **"Get Started for Free"**
2. Click **"Sign Up with GitHub"**
3. Authorize Render to access GitHub
4. Done! Account created (100% free)

### Step 3: Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Build and deploy from a Git repository"**
4. Click **"Next"**

### Step 4: Connect Repository
1. Click **"Connect account"** (if not connected)
2. Authorize Render to access repositories
3. Find: `ghostpay-anonymous-gateway`
4. Click **"Connect"**

### Step 5: Configure Service (Important!)
```
Name: ghostpay-payment-system
Region: Singapore (closest to India)
Branch: main
Root Directory: (leave blank)
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### Step 6: Select FREE Plan
**IMPORTANT:** Scroll down and select:
- Plan: **Free** (₹0/month)
- Instance Type: **Free**

### Step 7: Add Environment Variables
Click **"Advanced"** button, then **"Add Environment Variable"**

Add these ONE BY ONE:

```env
UPI_ID
Value: yourname@paytm

BANK_ACCOUNT_NUMBER
Value: 1234567890

BANK_IFSC
Value: SBIN0001234

BANK_ACCOUNT_NAME
Value: Your Full Name

BANK_NAME
Value: State Bank of India

BANK_BRANCH
Value: Main Branch

USDT_ADDRESS
Value: TYourWalletAddress

NODE_ENV
Value: production

PORT
Value: 10000
```

### Step 8: Deploy!
1. Click **"Create Web Service"**
2. Wait 2-3 minutes
3. Watch logs for "Server running on port 10000"
4. Done! 🎉

---

## 🌐 Your Live URL

After deployment completes:

```
Main URL: https://ghostpay-payment-system.onrender.com

Payment Page:
https://ghostpay-payment-system.onrender.com/independent.html

Test API:
https://ghostpay-payment-system.onrender.com/health
```

---

## ✅ Verify Deployment

### 1. Check Health Endpoint
Visit: `https://ghostpay-payment-system.onrender.com/health`

Should see:
```json
{
  "status": "online",
  "environment": "production"
}
```

### 2. Test Payment Page
Visit: `https://ghostpay-payment-system.onrender.com/independent.html`

Should see:
- Beautiful payment page
- UPI, Bank, Crypto options
- Your UPI ID in QR code

### 3. Test Real Payment
1. Enter ₹10
2. Select UPI
3. Scan QR with Google Pay
4. Pay ₹10
5. Check YOUR bank account
6. Money should be there! 💰

---

## 💰 Free Tier Details

### What You Get (100% Free):
- ✅ **750 hours/month** (enough for 24/7)
- ✅ **512 MB RAM**
- ✅ **Free SSL/HTTPS**
- ✅ **Auto deployments**
- ✅ **Custom domains**
- ✅ **No credit card needed**
- ✅ **No time limit** (free forever!)

### Limitations:
- ⚠️ Service sleeps after 15 min inactivity
- ⚠️ Takes 30 sec to wake up
- ⚠️ 750 hours/month limit

### Solution for Sleep:
Use free cron service to ping every 10 minutes:
1. Go to: https://cron-job.org
2. Create free account
3. Add job: `https://ghostpay-payment-system.onrender.com/health`
4. Schedule: Every 10 minutes
5. Done! Service stays awake 24/7

---

## 🔧 Post-Deployment Setup

### 1. View Logs
1. Go to Render dashboard
2. Click on your service
3. Click **"Logs"** tab
4. See real-time logs

### 2. Update Environment Variables
1. Go to **"Environment"** tab
2. Click **"Add Environment Variable"**
3. Add new variable
4. Service auto-redeploys

### 3. Custom Domain (Optional)
1. Go to **"Settings"** tab
2. Scroll to **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Enter: `yourdomain.com`
5. Add DNS record:
```
Type: CNAME
Name: @
Value: ghostpay-payment-system.onrender.com
```

---

## 📱 Share Your Payment Link

### For Customers:
```
Pay via UPI/Bank/Crypto:
https://ghostpay-payment-system.onrender.com/independent.html
```

### For Website:
```html
<a href="https://ghostpay-payment-system.onrender.com/independent.html">
  Pay Now - Zero Fees!
</a>
```

### For Social Media:
```
Accept payments with ZERO fees! 💰
Pay me directly via UPI/Bank/Crypto:
https://ghostpay-payment-system.onrender.com/independent.html
```

---

## 🎯 Real Payment Testing

### Test UPI Payment:
1. Visit: `https://ghostpay-payment-system.onrender.com/independent.html`
2. Enter: ₹10
3. Select: UPI
4. See: QR code with YOUR UPI ID
5. Scan: With Google Pay/PhonePe
6. Pay: ₹10
7. Check: YOUR bank account
8. Result: ₹10 in YOUR account! 💰

### Test Bank Transfer:
1. Select: Bank Transfer
2. See: YOUR bank details
3. Transfer: ₹10 via NEFT/IMPS
4. Enter: UTR number
5. Verify: In your bank statement
6. Result: ₹10 in YOUR account! 💰

### Test Crypto:
1. Select: Crypto (USDT)
2. See: YOUR wallet address
3. Send: 1 USDT
4. Enter: Transaction hash
5. System: Auto-verifies on blockchain
6. Result: 1 USDT in YOUR wallet! 💰

---

## 🔄 Auto Deployments

Render automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update payment system"
git push origin main

# Render automatically deploys! 🚀
# Check dashboard for status
```

---

## 🆘 Troubleshooting

### Issue: "Service unavailable"
**Reason:** Free tier sleeps after 15 min
**Solution:** 
1. Visit URL to wake it up
2. Wait 30 seconds
3. Or use cron-job.org to keep awake

### Issue: "Build failed"
**Solution:**
1. Check logs in dashboard
2. Make sure all files committed
3. Try manual deploy

### Issue: "Environment variables not working"
**Solution:**
1. Go to Environment tab
2. Check all variables added
3. Click "Manual Deploy"

### Issue: "Cannot find module"
**Solution:**
1. Check package.json exists
2. Check all dependencies listed
3. Redeploy

---

## 💡 Pro Tips

### 1. Keep Service Awake (Free)
Use cron-job.org:
```
URL: https://ghostpay-payment-system.onrender.com/health
Interval: Every 10 minutes
Cost: Free
```

### 2. Monitor Uptime (Free)
Use UptimeRobot:
```
URL: https://ghostpay-payment-system.onrender.com/health
Check: Every 5 minutes
Alerts: Email/SMS
Cost: Free
```

### 3. View Detailed Logs
```
Dashboard → Service → Logs → Filter by level
```

### 4. Manual Deploy
```
Dashboard → Service → Manual Deploy → Deploy latest commit
```

### 5. Rollback
```
Dashboard → Service → Events → Select old deploy → Redeploy
```

---

## 📊 Cost Breakdown

### Your Total Cost:
```
Render Hosting: ₹0/month (free tier)
Domain (optional): ₹99/year
SSL Certificate: ₹0 (free)
Cron Job: ₹0 (free)
Total: ₹0/month

vs Razorpay:
Monthly sales: ₹1,00,000
Razorpay fees: ₹2,360/month
Your savings: ₹2,360/month = ₹28,320/year!
```

---

## ✅ Deployment Checklist

- [ ] Render account created (free)
- [ ] Repository connected
- [ ] Service configured (Node, npm install, npm start)
- [ ] FREE plan selected
- [ ] Environment variables added
- [ ] Service deployed successfully
- [ ] Health endpoint working
- [ ] Payment page loading
- [ ] UPI QR code showing YOUR UPI ID
- [ ] Test payment successful
- [ ] Money received in YOUR account

---

## 🎉 Success!

Your payment system is now live on Render (100% FREE)!

**Live URL:** `https://ghostpay-payment-system.onrender.com/independent.html`

**What You Have:**
- ✅ Live payment system
- ✅ Zero hosting cost
- ✅ Zero platform fees
- ✅ Direct to your account
- ✅ UPI + Bank + Crypto
- ✅ 100% your control
- ✅ Free SSL/HTTPS
- ✅ Auto deployments

**Start accepting payments NOW!** 🚀💰

---

## 📞 Need Help?

**Render Support:**
- Dashboard: https://dashboard.render.com
- Docs: https://render.com/docs
- Community: https://community.render.com

**Project Issues:**
- GitHub: https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway/issues

---

## 🚀 Quick Commands

```bash
# View your service
https://dashboard.render.com

# Check logs
Dashboard → Service → Logs

# Manual deploy
Dashboard → Service → Manual Deploy

# Add variables
Dashboard → Service → Environment → Add

# Custom domain
Dashboard → Service → Settings → Custom Domain
```

**That's it! You're live with ZERO cost!** 🎉