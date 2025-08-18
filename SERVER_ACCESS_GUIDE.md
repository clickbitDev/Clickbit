# ClickBit Website - Server Access Guide

## ✅ Current Status
Both servers are **RUNNING** and **ACCESSIBLE**

### Backend API Server
- **Status**: ✅ Online
- **Port**: 5001
- **Database**: ✅ Healthy
- **Health Check**: http://localhost:5001/api/health

### Frontend React App
- **Status**: ✅ Online  
- **Port**: 3000
- **Configuration**: Accepts external connections
- **Proxy**: Configured to forward API requests to backend

## 🌐 Access URLs

### If you're accessing from the same machine:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Admin Panel**: http://localhost:3000/admin

### If you're accessing from a different machine/browser:
- **Frontend**: http://[SERVER_IP]:3000
- **Backend API**: http://[SERVER_IP]:5001
- **Admin Panel**: http://[SERVER_IP]:3000/admin

## 🔧 Troubleshooting

### If localhost is not loading:

1. **Check if you're in the right environment**
   - Are you accessing from the same machine where the servers are running?
   - If using a remote development environment, you may need the external IP

2. **Clear browser cache**
   ```
   Ctrl + F5 (Windows/Linux) or Cmd + Shift + R (Mac)
   ```

3. **Try different browsers**
   - Chrome: http://localhost:3000
   - Firefox: http://localhost:3000
   - Safari: http://localhost:3000

4. **Check firewall/network settings**
   - Ensure ports 3000 and 5001 are not blocked
   - If using a VPN, try disconnecting temporarily

5. **Verify servers are running**
   ```bash
   curl http://localhost:3000
   curl http://localhost:5001/api/health
   ```

### If you see connection errors:

1. **Restart the servers**
   ```bash
   cd /workspace
   npm run kill-all-ports
   npm start &
   cd client && HOST=0.0.0.0 npm start &
   ```

2. **Check server logs**
   ```bash
   tail -f /workspace/server.log
   tail -f /workspace/client.log
   ```

## 📱 Features Available

### Public Website (http://localhost:3000)
- ✅ Homepage with services
- ✅ Services page (no more loading/offline issues)
- ✅ Portfolio page
- ✅ Contact page
- ✅ About page
- ✅ All API connections working

### Admin Panel (http://localhost:3000/admin)
- ✅ Single sidebar (no more double sidebar)
- ✅ Dashboard with stats
- ✅ Blog management
- ✅ Portfolio management
- ✅ Services management
- ✅ Team management
- ✅ Contact management
- ✅ User management (admin only)

### API Endpoints (http://localhost:5001/api)
- ✅ `/health` - Server health check
- ✅ `/services` - Services data
- ✅ `/admin/*` - Admin functionality
- ✅ `/contact` - Contact form
- ✅ `/auth/*` - Authentication

## 🔐 Admin Login
- **URL**: http://localhost:3000/admin
- **Default Admin**: Check your database or create via API
- **Features**: Full CRUD operations for all content

## 🚀 Performance Optimizations
- ✅ Connection pooling (20 max connections)
- ✅ Automatic retry logic
- ✅ Health monitoring
- ✅ Graceful shutdown handling
- ✅ Error recovery mechanisms

## 📊 Monitoring
- **Health Check**: http://localhost:5001/api/health
- **Server Logs**: `/workspace/server.log`
- **Client Logs**: `/workspace/client.log`
- **Database**: SQLite (development) - healthy connection

---

**Last Updated**: $(date)
**Status**: All systems operational ✅