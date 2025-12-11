# Clickbit.com.au - Deployment Guide

This guide provides step-by-step instructions for deploying the Clickbit.com.au custom web application on Hostinger VPS.

## 🚀 Prerequisites

Before starting the deployment, ensure you have:

- A Hostinger VPS plan with root access
- Domain name (clickbit.com.au) pointed to your VPS
- SSH access to your VPS
- Basic knowledge of Linux commands

## 📋 Pre-Deployment Checklist

- [ ] VPS is provisioned and accessible
- [ ] Domain DNS is configured
- [ ] SSH keys are set up
- [ ] Backup strategy is planned
- [ ] SSL certificate is ready

## 🔧 Step 1: Server Setup

### 1.1 Connect to Your VPS

```bash
ssh root@your-server-ip
```

### 1.2 Update System Packages

```bash
# Update package list
sudo apt update

# Upgrade existing packages
sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

### 1.3 Install Node.js 18

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 1.4 Install MySQL 8.0

```bash
# Install MySQL
sudo apt install -y mysql-server

# Secure MySQL installation
sudo mysql_secure_installation

# Start and enable MySQL
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 1.5 Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### 1.6 Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 to start on boot
pm2 startup
```

## 🗄️ Step 2: Database Setup

### 2.1 Create Database and User

```bash
# Access MySQL as root
sudo mysql -u root -p

# Create database
CREATE DATABASE clickbit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user
CREATE USER 'clickbit_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';

# Grant privileges
GRANT ALL PRIVILEGES ON clickbit_db.* TO 'clickbit_user'@'localhost';

# Flush privileges
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

### 2.2 Test Database Connection

```bash
mysql -u clickbit_user -p clickbit_db
```

## 📁 Step 3: Application Deployment

### 3.1 Create Application Directory

```bash
# Create application directory
sudo mkdir -p /var/www/clickbit
sudo chown $USER:$USER /var/www/clickbit
cd /var/www/clickbit
```

### 3.2 Clone Repository

```bash
# Clone your repository (replace with your actual repo URL)
git clone https://github.com/your-username/clickbit-website.git .

# Or if you're uploading files manually, extract them here
```

### 3.3 Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3.4 Environment Configuration

```bash
# Copy environment file
cp env.example .env

# Edit environment file
nano .env
```

**Update the following variables in `.env`:**

```env
# Server Configuration
NODE_ENV=production
PORT=5000
HOST=localhost

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=clickbit_db
DB_USER=clickbit_user
DB_PASSWORD=your_secure_password_here

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
EMAIL_FROM=noreply@clickbit.com.au

# Frontend URL
FRONTEND_URL=https://clickbit.com.au

# Google Analytics
GA_TRACKING_ID=G-XXXXXXXXXX

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### 3.5 Build Application

```bash
# Build React application
cd client
npm run build
cd ..

# Create uploads directory
mkdir -p uploads
mkdir -p logs
```

### 3.6 Database Migration

```bash
# Run database migrations (if you have migration scripts)
npm run db:migrate

# Seed initial data (if you have seed scripts)
npm run db:seed
```

## 🔧 Step 4: PM2 Configuration

### 4.1 Create PM2 Ecosystem File

Create `ecosystem.config.js` in the root directory:

```javascript
module.exports = {
  apps: [{
    name: 'clickbit-api',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

### 4.2 Start Application with PM2

```bash
# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs
```

## 🌐 Step 5: Nginx Configuration

### 5.1 Create Nginx Site Configuration

```bash
# Create site configuration
sudo nano /etc/nginx/sites-available/clickbit
```

**Add the following configuration:**

```nginx
server {
    listen 80;
    server_name clickbit.com.au www.clickbit.com.au;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    
    # Client max body size
    client_max_body_size 10M;
    
    # Proxy to Node.js application
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Static files
    location /uploads {
        alias /var/www/clickbit/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Health check
    location /api/health {
        proxy_pass http://localhost:5000;
        access_log off;
    }
}
```

### 5.2 Enable Site and Test Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/clickbit /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## 🔒 Step 6: SSL Certificate

### 6.1 Install Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d clickbit.com.au -d www.clickbit.com.au

# Test automatic renewal
sudo certbot renew --dry-run
```

### 6.2 Update Nginx Configuration for SSL

The Certbot will automatically update your Nginx configuration. Verify it looks like this:

```nginx
server {
    server_name clickbit.com.au www.clickbit.com.au;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/clickbit.com.au/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/clickbit.com.au/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = www.clickbit.com.au) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
    
    if ($host = clickbit.com.au) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
    
    listen 80;
    server_name clickbit.com.au www.clickbit.com.au;
    return 404; # managed by Certbot
}
```

## 🔧 Step 7: Firewall Configuration

### 7.1 Configure UFW Firewall

```bash
# Install UFW if not installed
sudo apt install -y ufw

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## 📊 Step 8: Monitoring and Logs

### 8.1 Setup Log Rotation

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/clickbit
```

**Add the following configuration:**

```
/var/www/clickbit/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 8.2 Setup Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Monitor application
pm2 monit
```

## 🔄 Step 9: Backup Strategy

### 9.1 Database Backup

```bash
# Create backup script
nano /var/www/clickbit/backup-db.sh
```

**Add the following content:**

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/clickbit"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="clickbit_db"
DB_USER="clickbit_user"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Database backup completed: db_backup_$DATE.sql.gz"
```

```bash
# Make script executable
chmod +x /var/www/clickbit/backup-db.sh

# Add to crontab for daily backup
crontab -e
```

**Add this line to crontab:**
```
0 2 * * * /var/www/clickbit/backup-db.sh
```

### 9.2 Application Backup

```bash
# Create application backup script
nano /var/www/clickbit/backup-app.sh
```

**Add the following content:**

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/clickbit"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/clickbit"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create application backup (excluding node_modules and logs)
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz \
    --exclude=$APP_DIR/node_modules \
    --exclude=$APP_DIR/client/node_modules \
    --exclude=$APP_DIR/logs \
    --exclude=$APP_DIR/uploads \
    $APP_DIR

# Keep only last 7 days of backups
find $BACKUP_DIR -name "app_backup_*.tar.gz" -mtime +7 -delete

echo "Application backup completed: app_backup_$DATE.tar.gz"
```

```bash
# Make script executable
chmod +x /var/www/clickbit/backup-app.sh

# Add to crontab for weekly backup
crontab -e
```

**Add this line to crontab:**
```
0 3 * * 0 /var/www/clickbit/backup-app.sh
```

## 🚀 Step 10: Final Verification

### 10.1 Test Application

```bash
# Check if application is running
pm2 status

# Check logs
pm2 logs

# Test API endpoint
curl https://clickbit.com.au/api/health

# Check Nginx status
sudo systemctl status nginx

# Check MySQL status
sudo systemctl status mysql
```

### 10.2 Performance Optimization

```bash
# Install Redis for caching (optional)
sudo apt install -y redis-server
sudo systemctl enable redis-server

# Optimize MySQL
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

**Add these optimizations to MySQL config:**

```ini
[mysqld]
innodb_buffer_pool_size = 256M
innodb_log_file_size = 64M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT
query_cache_size = 32M
query_cache_type = 1
max_connections = 100
```

```bash
# Restart MySQL
sudo systemctl restart mysql
```

## 📈 Step 11: Analytics and Monitoring

### 11.1 Setup Google Analytics

1. Create a Google Analytics 4 property
2. Add the tracking code to your React application
3. Configure goals and conversions

### 11.2 Setup Error Monitoring

```bash
# Install Sentry CLI (optional)
npm install -g @sentry/cli

# Configure Sentry in your application
```

## 🔧 Step 12: Maintenance

### 12.1 Regular Updates

```bash
# Create update script
nano /var/www/clickbit/update.sh
```

**Add the following content:**

```bash
#!/bin/bash
cd /var/www/clickbit

# Pull latest changes
git pull origin main

# Install dependencies
npm install
cd client && npm install && cd ..

# Build application
cd client && npm run build && cd ..

# Restart application
pm2 restart all

echo "Application updated successfully"
```

```bash
# Make script executable
chmod +x /var/www/clickbit/update.sh
```

### 12.2 Security Updates

```bash
# Regular system updates
sudo apt update && sudo apt upgrade -y

# Update Node.js (when needed)
sudo npm install -g npm@latest

# Update PM2
sudo npm install -g pm2@latest
```

## 🆘 Troubleshooting

### Common Issues

1. **Application not starting:**
   ```bash
   pm2 logs
   pm2 restart all
   ```

2. **Database connection issues:**
   ```bash
   sudo systemctl status mysql
   mysql -u clickbit_user -p clickbit_db
   ```

3. **Nginx issues:**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   sudo tail -f /var/log/nginx/error.log
   ```

4. **SSL certificate issues:**
   ```bash
   sudo certbot certificates
   sudo certbot renew
   ```

### Performance Monitoring

```bash
# Monitor system resources
htop

# Monitor disk usage
df -h

# Monitor memory usage
free -h

# Monitor network usage
nethogs

# Monitor application performance
pm2 monit
```

## 📞 Support

For technical support:
- Check the logs: `pm2 logs` and `/var/log/nginx/`
- Review the application status: `pm2 status`
- Contact your development team
- Check the documentation in `/docs` directory

## 🔄 Rollback Plan

If you need to rollback:

1. **Database rollback:**
   ```bash
   mysql -u clickbit_user -p clickbit_db < /var/backups/clickbit/db_backup_YYYYMMDD_HHMMSS.sql
   ```

2. **Application rollback:**
   ```bash
   cd /var/www/clickbit
   git checkout <previous-commit-hash>
   npm install
   cd client && npm install && npm run build && cd ..
   pm2 restart all
   ```

---

**🎉 Congratulations! Your Clickbit.com.au custom web application is now deployed and running on Hostinger VPS.**

The application is now:
- ✅ Securely hosted on VPS
- ✅ Protected with SSL certificate
- ✅ Configured with proper monitoring
- ✅ Set up with automated backups
- ✅ Optimized for performance
- ✅ Ready for production traffic 