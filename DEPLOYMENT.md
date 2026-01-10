# 🚀 GhostPay Deployment Guide

## Local Development

### Prerequisites
- Node.js 16+ installed
- Git installed
- Terminal/Command Prompt

### Steps

1. **Clone Repository**
```bash
git clone https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway.git
cd ghostpay-anonymous-gateway
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

4. **Start Server**
```bash
npm start
```

5. **Access Application**
```
Open browser: http://localhost:3000
```

---

## Production Deployment

### Option 1: Railway (Recommended)

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Initialize Project**
```bash
railway init
```

4. **Deploy**
```bash
railway up
```

5. **Set Environment Variables**
```bash
railway variables set PORT=3000
railway variables set NODE_ENV=production
```

---

### Option 2: Heroku

1. **Install Heroku CLI**
```bash
# Download from: https://devcenter.heroku.com/articles/heroku-cli
```

2. **Login**
```bash
heroku login
```

3. **Create App**
```bash
heroku create ghostpay-app
```

4. **Deploy**
```bash
git push heroku main
```

5. **Set Config**
```bash
heroku config:set NODE_ENV=production
```

---

### Option 3: Docker

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

2. **Build Image**
```bash
docker build -t ghostpay .
```

3. **Run Container**
```bash
docker run -p 3000:3000 -d ghostpay
```

---

### Option 4: VPS (DigitalOcean, AWS, etc.)

1. **SSH into Server**
```bash
ssh user@your-server-ip
```

2. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Clone & Setup**
```bash
git clone https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway.git
cd ghostpay-anonymous-gateway
npm install
```

4. **Install PM2 (Process Manager)**
```bash
sudo npm install -g pm2
```

5. **Start with PM2**
```bash
pm2 start server.js --name ghostpay
pm2 save
pm2 startup
```

6. **Setup Nginx (Optional)**
```bash
sudo apt install nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/ghostpay

# Add:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/ghostpay /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Tor Hidden Service Deployment

### Setup Tor

1. **Install Tor**
```bash
sudo apt install tor
```

2. **Configure Tor**
```bash
sudo nano /etc/tor/torrc

# Add:
HiddenServiceDir /var/lib/tor/ghostpay/
HiddenServicePort 80 127.0.0.1:3000
```

3. **Restart Tor**
```bash
sudo systemctl restart tor
```

4. **Get Onion Address**
```bash
sudo cat /var/lib/tor/ghostpay/hostname
```

5. **Access via Tor Browser**
```
http://[your-onion-address].onion
```

---

## Security Hardening

### 1. Enable HTTPS (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 2. Firewall Setup
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Rate Limiting
Already implemented in code. Adjust in server.js if needed.

### 4. Environment Variables
Never commit `.env` file. Use secure secret management.

---

## Monitoring

### PM2 Monitoring
```bash
pm2 monit
pm2 logs ghostpay
```

### Health Check Endpoint
```bash
curl http://localhost:3000/health
```

---

## Backup & Recovery

### Database Backup (if using MongoDB/Redis)
```bash
# MongoDB
mongodump --db ghostpay --out /backup/

# Redis
redis-cli BGSAVE
```

### Code Backup
```bash
git push origin main
```

---

## Scaling

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Deploy multiple instances
- Use Redis for session storage

### Vertical Scaling
- Increase server resources
- Optimize Node.js memory
- Use clustering

---

## Troubleshooting

### Port Already in Use
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Permission Denied
```bash
sudo chown -R $USER:$USER /path/to/ghostpay
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Production Checklist

- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Firewall configured
- [ ] Rate limiting enabled
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Error logging configured
- [ ] Security headers added
- [ ] CORS properly configured
- [ ] Database secured (if applicable)

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/samarthkumar096-commits/ghostpay-anonymous-gateway/issues
- Documentation: See README.md and ARCHITECTURE.md

---

**⚠️ Remember:** This is an educational prototype. Production deployment requires proper security audits, legal compliance, and regulatory approval.