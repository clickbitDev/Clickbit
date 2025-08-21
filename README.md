# ClickBit - Digital Solutions Platform

[![ClickBit Logo](client/public/images/logos/Click%20Bit%20Logo%20Vec%20Full.png)](https://clickbit.com.au)

> **Your Digital Partner** - From concept to conversion, we're with you every step of the way.

## 🚀 Overview

ClickBit is a comprehensive digital solutions platform that empowers businesses with innovative web and software solutions. Built with modern technologies, it provides a robust foundation for digital transformation, content management, and business growth.

## ✨ Features

### 🌐 **Public Platform**
- **Professional Website**: Modern, responsive design with dark/light theme support
- **Service Showcase**: Comprehensive display of digital services and solutions
- **Portfolio Management**: Showcase of completed projects and work
- **Blog System**: Content management with SEO optimization
- **Contact & Inquiry**: Multi-channel communication system
- **Testimonials**: Client feedback and success stories

### 🔐 **Authentication System**
- User registration and login
- Email verification
- Password reset functionality
- Role-based access control (User, Manager, Admin)

### 🛒 **E-commerce Integration**
- Service catalog and pricing
- Shopping cart functionality
- Secure checkout process
- Order management system
- Payment processing integration

### 🎛️ **Admin Panel**
- **Content Management**: Dynamic content editing and management
- **User Management**: User administration and role management
- **Service Management**: Service catalog administration
- **Portfolio Management**: Project showcase administration
- **Blog Management**: Content creation and publishing
- **Order Management**: E-commerce order processing
- **Analytics Dashboard**: Performance metrics and insights

### 📱 **Responsive Design**
- Mobile-first approach
- Cross-browser compatibility
- Progressive Web App features
- Optimized for all device sizes

## 🏗️ Architecture

### **Frontend**
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Context API** for state management

### **Backend**
- **Node.js** with Express
- **MySQL** database with Sequelize ORM
- **JWT** authentication
- **Socket.io** for real-time features
- **Multer** for file uploads

### **Infrastructure**
- **Nginx** reverse proxy
- **PM2** process manager
- **Docker** containerization support
- **Environment-based** configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clickbit
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   # Import the database schema
   mysql -u your_user -p your_database < clickbitdb_hostinger.sql
   ```

5. **Start the application**
   ```bash
   # Start backend
   npm run dev
   
   # Start frontend (in another terminal)
   cd client
   npm start
   ```

### Production Deployment

```bash
# Build the frontend
cd client
npm run build

# Start production server
npm run start:prod
```

## 📁 Project Structure

```
clickbit/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── utils/             # Backend utilities
├── documentations/         # Project documentation
├── scripts/                # Utility scripts
├── migrations/             # Database migrations
└── package.json
```

## 🎨 Theme System

ClickBit features a sophisticated theme system with:
- **Light Mode**: Clean, professional appearance
- **Dark Mode**: Modern, eye-friendly interface
- **Dynamic Logo Switching**: Automatic logo adaptation based on theme
- **Smooth Transitions**: Elegant theme switching animations

## 🔧 Configuration

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=clickbit

# JWT
JWT_SECRET=your_jwt_secret

# Server
PORT=3000
NODE_ENV=development
```

### Nginx Configuration
The project includes optimized Nginx configurations for:
- Reverse proxy setup
- SSL termination
- Static file serving
- Gzip compression
- Cache optimization

## 📊 Performance Features

- **Image Optimization**: Automatic image compression and optimization
- **Lazy Loading**: Efficient resource loading
- **Code Splitting**: Optimized bundle sizes
- **Caching Strategies**: Multiple caching layers
- **CDN Ready**: Optimized for content delivery networks

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permission system
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Cross-site scripting prevention
- **CSRF Protection**: Cross-site request forgery protection

## 🧪 Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
npm test
```

## 📈 Monitoring & Logging

- **Real-time Monitoring**: Socket-based connection monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Application performance monitoring
- **User Analytics**: User behavior tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software owned by ClickBit. All rights reserved.

## 📞 Support

- **Website**: [https://clickbit.com.au](https://clickbit.com.au)
- **Email**: info@clickbit.com.au
- **Phone**: +61 2 7229 9577
- **Mobile**: +61 422 512 130

## 🏢 About ClickBit

ClickBit is a leading digital solutions provider based in Moorebank, NSW, Australia. We specialize in:

- **Web Development**: Custom websites and web applications
- **Software Solutions**: Enterprise software development
- **Digital Marketing**: SEO, SEM, and social media marketing
- **E-commerce**: Online store development and optimization
- **Consulting**: Digital transformation and strategy consulting

---

**Built with ❤️ by the ClickBit Team**

*Empowering businesses with innovative digital solutions to connect, engage, and grow.*
