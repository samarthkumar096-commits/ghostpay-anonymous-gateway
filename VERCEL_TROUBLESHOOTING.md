# 🚀 Vercel Deployment - Step by Step (With Screenshots Guide)

## ❌ Common Issues & Solutions

### Issue 1: "Repository not found" or "Cannot clone"
**Solution:**
1. Make sure repository is **public** (not private)
2. Check repository URL is correct
3. Try manual import instead of one-click

---

### Issue 2: "Build failed" or "Deployment failed"
**Solution:**
1. Check `package.json` exists
2. Check `server.js` exists
3. Check `vercel.json` exists
4. All files are committed to GitHub

---

### Issue 3: "Environment variables missing"
**Solution:**
Add these AFTER deployment in Vercel dashboard

---

## 🎯 Method 1: Manual Import (Most Reliable)

### Step 1: Go to Vercel
```
https://vercel.com
```

### Step 2: Sign Up/Login
- Click "Sign Up" or "Login"
- Use GitHub account (recommended)
- Authorize Vercel to access GitHub

### Step 3: Create New Project
1. Click **"Add New..."** button (top right)
2. Select **"Project"**
3. Click **"Import Git Repository"**

### Step 4: Import Repository
1. Find your repository: `samarthkumar096-commits/ghostpay-anonymous-gateway`
2. Click **"Import"**
3. If not visible, click **"Adjust GitHub App Permissions"**
4. Give Vercel access to this repository

### Step 5: Configure Project
```
Framework Preset: Other
Root Directory: ./
Build Command: (leave empty)
Output Directory: public
Install Command: npm install
```

### Step 6: Add Environment Variables (IMPORTANT!)
Click **"Environment Variables"** and add:

```env
UPI_ID=yourname@paytm
BANK_ACCOUNT_NUMBER=1234567890
BANK_IFSC=SBIN0001234
BANK_ACCOUNT_NAME=Your Full Name
BANK_NAME=State Bank of India
BANK_BRANCH=Main Branch
USDT_ADDRESS=TYourWalletAddress
```

**Note:** Add these for **Production** environment

### Step 7: Deploy
1. Click **"Deploy"**
2. Wait 1-2 minutes
3. Done! 🎉

---

## 🎯 Method 2: Vercel CLI (For Developers)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login
```bash
vercel login
```
Enter your email and verify

### Step 3: Clone Repository
```bash
git clone https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway.git
cd ghostpay-anonymous-gateway
```

### Step 4: Deploy
```bash
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N**
- Project name? **ghostpay** (or any name)
- Directory? **./** (press Enter)

### Step 5: Add Environment Variables
```bash
vercel env add UPI_ID production
# Enter value: yourname@paytm

vercel env add BANK_ACCOUNT_NUMBER production
# Enter value: 1234567890

vercel env add BANK_IFSC production
# Enter value: SBIN0001234

vercel env add BANK_ACCOUNT_NAME production
# Enter value: Your Name

vercel env add USDT_ADDRESS production
# Enter value: TYourWalletAddress
```

### Step 6: Deploy to Production
```bash
vercel --prod
```

---

## 🎯 Method 3: GitHub Integration (Auto Deploy)

### Step 1: Connect GitHub
1. Go to Vercel dashboard
2. Click **"Import Project"**
3. Select **"Import Git Repository"**
4. Choose **GitHub**
5. Authorize Vercel

### Step 2: Select Repository
1. Find: `samarthkumar096-commits/ghostpay-anonymous-gateway`
2. Click **"Import"**

### Step 3: Configure
Same as Method 1 (Step 5)

### Step 4: Enable Auto Deploy
Once deployed:
- Every push to `main` branch = Auto deploy
- Pull requests = Preview deployments
- Automatic!

---

## ✅ Verify Deployment

### Check if Live:
```
Your URL: https://your-project.vercel.app

Test pages:
- https://your-project.vercel.app/independent.html
- https://your-project.vercel.app/payx.html
- https://your-project.vercel.app/index.html

Test API:
- https://your-project.vercel.app/health
```

### Expected Response from /health:
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

---

## 🔧 Troubleshooting

### Problem: "Cannot find module 'express'"
**Solution:**
```bash
# Make sure package.json has all dependencies
# Redeploy
vercel --prod --force
```

### Problem: "404 Not Found"
**Solution:**
Check `vercel.json` routes are correct

### Problem: "Environment variables not working"
**Solution:**
```bash
# Pull environment variables
vercel env pull

# Redeploy
vercel --prod
```

### Problem: "Build timeout"
**Solution:**
- Check if all files are committed
- Check package.json is valid
- Try deploying again

### Problem: "API routes not working"
**Solution:**
Make sure `vercel.json` has:
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    }
  ]
}
```

---

## 📱 After Deployment

### 1. Test Payment System
```
Visit: https://your-project.vercel.app/independent.html

Test:
1. Enter amount: ₹100
2. Select UPI
3. Check if QR code generates
4. Check if your UPI ID shows
```

### 2. Test API
```bash
curl https://your-project.vercel.app/health
```

### 3. Add Custom Domain (Optional)
```bash
vercel domains add yourdomain.com
```

Then add DNS records:
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

---

## 🎯 Quick Checklist

Before deploying, make sure:

- [ ] Repository is public
- [ ] `package.json` exists
- [ ] `server.js` exists
- [ ] `vercel.json` exists
- [ ] `public/` folder has HTML files
- [ ] All files committed to GitHub
- [ ] You have Vercel account
- [ ] You have your payment details ready

---

## 💡 Pro Tips

### 1. Use Preview Deployments
```bash
# Deploy to preview URL (not production)
vercel

# Test everything
# Then promote to production
vercel --prod
```

### 2. Check Logs
```bash
# View deployment logs
vercel logs

# View specific deployment
vercel logs [deployment-url]
```

### 3. Rollback if Needed
```bash
# List deployments
vercel ls

# Promote old deployment to production
vercel promote [deployment-url]
```

### 4. Environment-Specific Variables
```bash
# Add for development
vercel env add UPI_ID development

# Add for preview
vercel env add UPI_ID preview

# Add for production
vercel env add UPI_ID production
```

---

## 🆘 Still Having Issues?

### Option 1: Try Railway Instead
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Option 2: Try Render
1. Go to render.com
2. Connect GitHub
3. Deploy as Web Service

### Option 3: Use Your Own Server
```bash
# On your server
git clone https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway.git
cd ghostpay-anonymous-gateway
npm install
npm start
```

---

## 📞 Need Help?

**Common Issues:**
1. Repository not found → Make it public
2. Build failed → Check package.json
3. 404 errors → Check vercel.json routes
4. API not working → Check environment variables

**Contact:**
- GitHub Issues: https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway/issues
- Email: support@yourdomain.com

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Vercel shows "Deployment Ready"
2. ✅ You can access: `https://your-project.vercel.app`
3. ✅ `/health` endpoint returns JSON
4. ✅ `/independent.html` loads payment page
5. ✅ QR code generates with your UPI ID
6. ✅ No console errors

---

## 🎉 You're Live!

Once deployed:
- Share your URL with customers
- Start accepting payments
- Keep 100% of your money
- Zero platform fees!

**Your live payment system:**
```
https://your-project.vercel.app/independent.html
```

**Enjoy! 🚀💰**