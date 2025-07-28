# Clickbit.com.au - Custom Web Application

A modern, scalable custom web application built to replace the existing WordPress site with enhanced features, complete control, and superior performance.

## 🚀 Strategic Overview

This custom web application addresses the limitations of WordPress by providing:
- **Complete Control**: Full ownership over design, functionality, and data
- **Enhanced Features**: Native integration of payment processing, user management, and e-commerce
- **Superior Performance**: Optimized codebase with modern technologies
- **Scalability**: Built to grow with your business needs
- **Security**: Enterprise-grade security built from the ground up

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern UI framework with hooks and context
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **Sequelize** - ORM for database management
- **JWT** - Authentication and authorization
- **Stripe** - Payment processing
- **Nodemailer** - Email functionality

### DevOps & Tools
- **Hostinger VPS** - Hosting platform
- **PM2** - Process manager
- **Nginx** - Reverse proxy
- **SSL/HTTPS** - Security certificates
- **Git** - Version control

## 📋 Features

### Core Functionality
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **User Authentication** - Secure login/registration
- ✅ **E-commerce Platform** - Product catalog, cart, checkout
- ✅ **Payment Integration** - Stripe payment processing
- ✅ **Content Management** - Dynamic content updates
- ✅ **SEO Optimization** - Meta tags, sitemaps, structured data
- ✅ **Analytics Integration** - Google Analytics tracking
- ✅ **Contact Forms** - Interactive lead generation
- ✅ **Blog System** - Content publishing platform
- ✅ **Admin Dashboard** - Content and user management

### Advanced Features
- 🔒 **Role-Based Access Control** - User permissions
- 📊 **Real-time Analytics** - Performance monitoring
- 🔔 **Email Notifications** - Automated communications
- 🖼 **Image Optimization** - Automatic compression
- 🌐 **Multi-language Support** - Internationalization ready
- 📱 **PWA Capabilities** - Progressive Web App features

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clickbit-website
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
clickbit-website/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS and styling
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── utils/            # Utility functions
├── database/             # Database migrations & seeds
├── docs/                 # Documentation
└── package.json
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=clickbit_db
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Google Analytics
GA_TRACKING_ID=G-XXXXXXXXXX

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## 🚀 Deployment

### Hostinger VPS Deployment

1. **Server Setup**
   ```bash
   # Connect to your VPS
   ssh root@your-server-ip
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js, MySQL, Nginx
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs mysql-server nginx
   ```

2. **Database Setup**
   ```bash
   sudo mysql_secure_installation
   mysql -u root -p
   CREATE DATABASE clickbit_db;
   CREATE USER 'clickbit_user'@'localhost' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON clickbit_db.* TO 'clickbit_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Application Deployment**
   ```bash
   # Clone repository
   git clone <repository-url> /var/www/clickbit
   cd /var/www/clickbit
   
   # Install dependencies
   npm run install-all
   npm run build
   
   # Setup PM2
   npm install -g pm2
   pm2 start ecosystem.config.js
   pm2 startup
   ```

4. **Nginx Configuration**
   ```bash
   sudo nano /etc/nginx/sites-available/clickbit
   ```

   ```nginx
   server {
       listen 80;
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
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/clickbit /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **SSL Certificate**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d clickbit.com.au -d www.clickbit.com.au
   ```

## 🔒 Security Features

- **Helmet.js** - Security headers
- **Rate Limiting** - API protection
- **Input Validation** - Data sanitization
- **CORS Protection** - Cross-origin security
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Content Security Policy
- **CSRF Protection** - Cross-site request forgery prevention

## 📊 Performance Optimization

- **Image Optimization** - Automatic compression and WebP conversion
- **Code Splitting** - Lazy loading of components
- **Caching** - Redis caching for database queries
- **CDN Integration** - Content delivery network
- **Gzip Compression** - Reduced file sizes
- **Database Indexing** - Optimized queries

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit
npm run test:integration
```

## 📈 Monitoring & Analytics

- **Google Analytics 4** - User behavior tracking
- **Google Search Console** - SEO monitoring
- **Performance Monitoring** - Real-time metrics
- **Error Tracking** - Automated error reporting
- **Uptime Monitoring** - Service availability

## 🔄 Migration from WordPress

The application includes tools for migrating content from your existing WordPress site:

1. **Export WordPress Data**
   - Database export via phpMyAdmin
   - File system backup via FTP

2. **Import to Custom App**
   - Run migration scripts
   - Transform data to new schema
   - Update URLs and references

3. **DNS Update**
   - Point domain to new VPS
   - Configure SSL certificates

## 📞 Support

For technical support or questions:
- **Email**: support@clickbit.com.au
- **Documentation**: `/docs` directory
- **Issues**: GitHub issues tracker

## 📄 License

This project is proprietary software developed for Clickbit.com.au. All rights reserved.

---

**Built with ❤️ for Clickbit.com.au**

## Power Your Project Form

The Power Your Project form at `/power-your-project` is now fully functional and will:

1. **Collect comprehensive project details** through a 6-step process
2. **Save submissions to the database** in the `contacts` table
3. **Send email notifications** to `info@clickbit.com.au` with subject "Client Form Submission"
4. **Provide real-time validation** and cost estimates
5. **Store all form data** including selected services and features

### Email Configuration

To enable email notifications, configure the following environment variables:

```bash
# Option 1: SMTP Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Option 2: Gmail (alternative)
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password

# From email address
FROM_EMAIL=noreply@clickbit.com.au
```

### Email Templates

The system includes professional email templates for:
- **Project Submissions**: Detailed project information with client details
- **Contact Form**: General inquiry notifications
- **Review Submissions**: Customer feedback notifications

## Installation

1. Clone the repository
2. Install dependencies: `npm run install-all`
3. Set up environment variables (see `env.example`)
4. Configure database connection
5. Start the development server: `npm run dev`

## API Endpoints

- `POST /api/contact` - Handle form submissions (contact, review, project)
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/admin/*` - Admin routes (protected)

## Database Schema

The form submissions are stored in the `contacts` table with:
- Basic contact information
- Project details (for project submissions)
- Selected services and features
- Submission metadata (IP, source, timestamps)

## Development

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express, Sequelize ORM
- **Database**: MySQL
- **Email**: Nodemailer with configurable SMTP

## License

MIT License 