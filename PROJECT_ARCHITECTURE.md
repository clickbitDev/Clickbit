# ClickBit Project Architecture & Communication Flow

## 📋 Project Overview

ClickBit is a full-stack web application built with React (TypeScript) frontend and Node.js/Express backend, featuring e-commerce capabilities, content management, real-time notifications, and payment processing.

---

## 🏗️ Project Structure

```
clickbit/
├── client/                 # React/TypeScript Frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts (Auth, Cart, Socket, etc.)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript type definitions
│   ├── build/             # Production build output (gitignored)
│   └── package.json
│
├── server/                 # Node.js/Express Backend
│   ├── config/            # Database & app configuration
│   ├── middleware/        # Express middleware (auth, upload, etc.)
│   ├── models/            # Sequelize ORM models
│   ├── routes/            # API route handlers
│   ├── services/          # Business logic services
│   ├── scripts/           # Utility scripts
│   ├── seeders/           # Database seeders
│   ├── backups/           # Database backups (gitignored)
│   └── index.js           # Server entry point
│
├── migrations/            # Database migrations
├── scripts/               # Deployment & utility scripts
├── documentations/        # Project documentation
├── logs/                  # Application logs (gitignored)
├── .env                   # Environment variables (gitignored)
├── package.json           # Root package.json
└── ecosystem.config.js    # PM2 configuration
```

---

## 🔄 Client-Server Communication

### 1. **HTTP API Communication**

#### API Configuration
- **Base URL**: Configured via `REACT_APP_API_URL` environment variable
- **Default**: `/api` (relative path, uses proxy in development)
- **Production**: Full URL (e.g., `https://clickbit.com.au/api`)

#### Communication Flow
```
Client (React)                    Server (Express)
     │                                  │
     │  HTTP Request (Axios)           │
     ├─────────────────────────────────>│
     │  GET/POST/PUT/DELETE /api/*     │
     │  Headers: Authorization: Bearer │
     │                                  │
     │                                  │  Process Request
     │                                  │  - Authentication
     │                                  │  - Business Logic
     │                                  │  - Database Query
     │                                  │
     │  HTTP Response (JSON)           │
     │<─────────────────────────────────┤
     │  Status: 200/400/401/500        │
     │  Body: { data, message, ... }   │
```

#### Key API Endpoints

**Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

**Content:**
- `GET /api/services` - Get all services
- `GET /api/content/portfolio` - Get portfolio items
- `GET /api/content/blog` - Get blog posts
- `GET /api/reviews` - Get reviews

**Admin:**
- `GET /api/admin/*` - Admin panel endpoints
- `POST /api/upload/*` - File uploads

**Orders & Payments:**
- `POST /api/orders` - Create order
- `POST /api/payments` - Process payment (Stripe)

### 2. **Real-Time Communication (Socket.IO)**

#### Socket Connection
- **URL**: `window.location.origin` (same origin as frontend)
- **Transport**: WebSocket with polling fallback
- **Authentication**: Token-based via `authenticate` event

#### Communication Flow
```
Client (Socket.IO Client)          Server (Socket.IO Server)
     │                                  │
     │  io.connect(origin)             │
     ├─────────────────────────────────>│
     │                                  │
     │  emit('authenticate', {token})   │
     ├─────────────────────────────────>│
     │                                  │  Verify JWT Token
     │                                  │
     │  on('authenticated', {user})     │
     │<─────────────────────────────────┤
     │                                  │
     │  Real-time Events:               │
     │  - notifications                 │
     │  - order_updates                 │
     │  - admin_alerts                  │
     │<─────────────────────────────────┤
```

#### Socket Events
- **Client → Server:**
  - `authenticate` - Authenticate socket connection
  - `join_room` - Join notification room
  - `leave_room` - Leave notification room

- **Server → Client:**
  - `authenticated` - Authentication success
  - `auth_error` - Authentication failure
  - `notification` - New notification
  - `order_update` - Order status update
  - `admin_alert` - Admin alerts

---

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Login:**
   ```
   Client → POST /api/auth/login {email, password}
   Server → Validates credentials → Returns JWT token
   Client → Stores token in localStorage
   ```

2. **Authenticated Requests:**
   ```
   Client → Adds Authorization: Bearer <token> header
   Server → Validates token via middleware
   Server → Attaches user to request object
   ```

3. **Socket Authentication:**
   ```
   Client → Connects to Socket.IO
   Client → Emits 'authenticate' event with token
   Server → Validates token → Emits 'authenticated' event
   ```

### Authorization Levels
- **Public**: No authentication required
- **User**: Requires valid JWT token
- **Admin**: Requires admin role
- **Manager**: Requires manager or admin role

---

## 🗄️ Database Architecture

### Database System
- **Production**: MySQL (via Sequelize ORM)
- **Development**: SQLite (optional)
- **ORM**: Sequelize 6.x

### Key Models
- `User` - User accounts and authentication
- `Product` - Product catalog
- `Order` / `OrderItem` - E-commerce orders
- `Payment` - Payment transactions (Stripe)
- `Service` - Service offerings
- `BlogPost` - Blog content
- `PortfolioItem` - Portfolio showcase
- `Review` - Customer reviews
- `Content` - Dynamic content management
- `Team` - Team member profiles
- `Analytics` - Analytics data
- `Notification` - User notifications

---

## 📦 Technology Stack

### Frontend
- **Framework**: React 18.2.0
- **Language**: TypeScript 4.9.5
- **Styling**: Tailwind CSS 3.3.6
- **State Management**: Zustand, React Context
- **Routing**: React Router DOM 6.20.1
- **HTTP Client**: Axios 1.6.2
- **Real-time**: Socket.IO Client 4.8.1
- **Forms**: React Hook Form 7.48.2
- **Payments**: Stripe React SDK 2.1.2
- **Animations**: Framer Motion 10.16.5

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 4.18.2
- **Database**: MySQL2 3.6.5 (via Sequelize 6.37.7)
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Real-time**: Socket.IO 4.8.1
- **File Upload**: Multer 1.4.5
- **Image Processing**: Sharp 0.32.6
- **Email**: Nodemailer 7.0.9
- **Payments**: Stripe 14.25.0
- **Security**: Helmet 7.1.0, CORS 2.8.5
- **Logging**: Winston 3.11.0

### DevOps
- **Process Manager**: PM2 (ecosystem.config.js)
- **Containerization**: Docker
- **Reverse Proxy**: Nginx (production)
- **Monitoring**: Health checks, connection monitoring

---

## 🚀 Deployment Architecture

### Production Setup
```
Internet
   │
   ├─> Nginx (Reverse Proxy)
   │      │
   │      ├─> Port 443 (HTTPS) → Frontend (React Build)
   │      │
   │      └─> /api/* → Backend (Node.js/Express)
   │
   ├─> PM2 Cluster Mode
   │      │
   │      ├─> Instance 1 (Port 5001)
   │      └─> Instance 2 (Port 5001) - Load Balanced
   │
   └─> MySQL Database (Port 3306)
```

### Environment Configuration

**Backend (.env):**
```env
NODE_ENV=production
PORT=5001
DB_HOST=localhost
DB_USER=clickbit_user
DB_PASSWORD=***
DB_NAME=clickbitdb
JWT_SECRET=***
FRONTEND_URL=https://clickbit.com.au
STRIPE_SECRET_KEY=sk_live_***
SMTP_HOST=smtp.hostinger.com
SMTP_USER=contact@clickbit.com.au
```

**Frontend (client/.env):**
```env
REACT_APP_API_URL=https://clickbit.com.au/api
GENERATE_SOURCEMAP=false
```

---

## 📁 File Upload System

### Upload Directories
- **Portfolio**: `client/public/images/uploads/portfolio/`
- **Blog**: `client/public/images/uploads/blog/`
- **Team**: `client/public/images/uploads/team/`

### Upload Flow
1. Client uploads file via `POST /api/upload/{type}`
2. Server receives file via Multer middleware
3. Server compresses image using Sharp
4. Server saves to `client/public/images/uploads/{type}/`
5. In production, file is also copied to `client/build/images/uploads/{type}/`

### Image Processing
- **Format**: Converted to WebP
- **Compression**: 80-85% quality
- **Resizing**: Max dimensions (portfolio: 800x600, blog: 1200x900)
- **File Size Limit**: 5MB per file

---

## 🔒 Security Features

### Backend Security
- **Helmet.js**: Security headers
- **CORS**: Configured for specific origins
- **Rate Limiting**: Express rate limiter
- **JWT Authentication**: Token-based auth
- **Password Hashing**: bcryptjs
- **Input Validation**: express-validator
- **SQL Injection Protection**: Sequelize ORM
- **XSS Protection**: DOMPurify, helmet XSS filter

### Frontend Security
- **XSS Protection**: DOMPurify for user content
- **Secure Storage**: localStorage for tokens (consider httpOnly cookies for production)
- **HTTPS**: Enforced in production
- **Content Security Policy**: Via Helmet

---

## 📊 Monitoring & Logging

### Logging
- **Backend**: Winston logger
- **Log Files**: `logs/combined.log`, `logs/error.log`
- **Log Rotation**: PM2 log rotation
- **Log Levels**: error, warn, info, debug

### Health Checks
- **Endpoint**: `GET /api/health`
- **Monitoring**: Connection monitoring service
- **Alerts**: Analytics alerts service

---

## 🔄 Development Workflow

### Local Development
1. **Start Backend**: `npm start` (port 5001)
2. **Start Frontend**: `cd client && npm start` (port 3000)
3. **Proxy**: Frontend proxies `/api/*` to `http://localhost:5001`

### Build Process
1. **Frontend Build**: `cd client && npm run build`
2. **Output**: `client/build/` directory
3. **Server**: Serves static files from `client/build/` in production

### Database Migrations
- **Run Migrations**: `npm run migrate`
- **Undo Migration**: `npm run migrate:undo`
- **Seed Data**: `npm run seed`

---

## 📝 Key Configuration Files

### Root Level
- `package.json` - Root dependencies and scripts
- `ecosystem.config.js` - PM2 process configuration
- `.env` - Environment variables (gitignored)
- `Dockerfile` - Docker container configuration
- `nodemon.json` - Development auto-reload config

### Client
- `client/package.json` - Frontend dependencies
- `client/tsconfig.json` - TypeScript configuration
- `client/tailwind.config.js` - Tailwind CSS configuration
- `client/.env` - Frontend environment variables

### Server
- `server/index.js` - Express server entry point
- `server/config/database.js` - Database configuration
- `server/config/config.js` - Sequelize configuration
- `server/middleware/auth.js` - Authentication middleware

---

## 🎯 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## 🔗 External Integrations

### Payment Processing
- **Stripe**: Payment gateway integration
- **PayPal**: PayPal SDK integration (optional)

### Email Service
- **SMTP**: Hostinger SMTP server
- **Service**: Nodemailer

### Analytics (Optional)
- **Google Analytics**: GA4 tracking
- **BigQuery**: Analytics data warehouse
- **Google Ads**: Conversion tracking

---

## 📌 Important Notes

1. **Environment Variables**: Never commit `.env` files (handled by .gitignore)
2. **Build Output**: `client/build/` is gitignored (generated during build)
3. **Uploads**: User-uploaded files are gitignored
4. **Database**: SQLite files and SQL dumps are gitignored
5. **Logs**: All log files are gitignored
6. **Secrets**: API keys, tokens, and certificates are gitignored

---

## 🛠️ Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check `REACT_APP_API_URL` in `client/.env`
   - Verify backend server is running on port 5001
   - Check CORS configuration

2. **Socket Connection Failed**
   - Verify Socket.IO server is running
   - Check authentication token
   - Verify CORS settings for Socket.IO

3. **Database Connection Failed**
   - Check database credentials in `.env`
   - Verify MySQL server is running
   - Check database exists and user has permissions

4. **Build Failures**
   - Clear `node_modules` and reinstall
   - Clear `client/build` directory
   - Check Node.js version (requires 18+)

---

**Last Updated**: 2025-01-22
**Version**: 1.0.0

