# ClickBit Local Development Guide

## 🚀 Quick Start

### Option 1: Start Everything Together
```bash
./start-all.sh
```

### Option 2: Start Servers Separately

**Terminal 1 (Backend):**
```bash
./start-backend.sh
```

**Terminal 2 (Frontend):**
```bash
./start-frontend.sh
```

## 📍 Access URLs

- **Website**: http://localhost:3000
- **API**: http://localhost:5001/api/health
- **Admin Panel**: http://localhost:3000/admin

## 🔧 Admin Credentials

- **Email**: admin@clickbit.com.au
- **Password**: Admin123!

## 🐛 Troubleshooting

### If services/portfolio/blogs don't load:

1. **Check API connection:**
   ```bash
   curl http://localhost:5001/api/services
   ```

2. **Clear React cache:**
   ```bash
   cd client
   rm -rf node_modules/.cache
   npm start
   ```

3. **Check browser console** for any JavaScript errors

4. **Verify environment variables:**
   - Backend: `server/.env` should have `PORT=5001`
   - Frontend: `client/.env` should have `REACT_APP_API_URL=http://localhost:5001/api`

### Common Issues:

- **Port conflicts**: Kill existing processes with `pkill -f "node\|react-scripts"`
- **Database issues**: Run `cd server && node scripts/initDatabase.js`
- **Dependency issues**: Run `npm install` in both `server/` and `client/` directories

## 📁 Project Structure

```
clickbit/
├── server/           # Backend API (Node.js/Express)
├── client/           # Frontend (React)
├── start-all.sh      # Start both servers
├── start-backend.sh  # Start only backend
└── start-frontend.sh # Start only frontend
```

## 🔄 Development Workflow

1. Make changes to code
2. Servers will auto-reload (nodemon for backend, React dev server for frontend)
3. Test changes in browser
4. Check console/network tabs for any issues

## 📊 API Endpoints

- `GET /api/services` - Get all services
- `GET /api/content/portfolio` - Get portfolio items
- `GET /api/content/blog` - Get blog posts
- `POST /api/auth/login` - Admin login
- `GET /api/health` - Server health check
