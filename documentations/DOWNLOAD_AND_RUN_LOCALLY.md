# 🏠 Run ClickBit Locally - Alternative Approach

## 🎯 **New Strategy: Local Development**

Since the remote server setup is causing port forwarding issues, let's get this running directly on your local machine.

## 📥 **Step 1: Download the Project**

### Option A: Git Clone (Recommended)
```bash
git clone <your-repository-url>
cd clickbit-website
```

### Option B: Download ZIP
1. Download the project as a ZIP file
2. Extract it to your desired folder
3. Open terminal/command prompt in that folder

## 🚀 **Step 2: Run the Setup Script**

```bash
chmod +x local-setup-script.sh
./local-setup-script.sh
```

This script will:
- ✅ Check Node.js and npm installation
- ✅ Install all dependencies (backend + frontend)
- ✅ Create proper environment files
- ✅ Set up the database
- ✅ Create startup scripts
- ✅ Generate a development guide

## 🏃‍♂️ **Step 3: Start the Application**

### Quick Start (Both servers together):
```bash
./start-all.sh
```

### Manual Start (Separate terminals):

**Terminal 1 - Backend:**
```bash
./start-backend.sh
```

**Terminal 2 - Frontend:**
```bash
./start-frontend.sh
```

## 📍 **Step 4: Access Your Site**

- **Website**: http://localhost:3000
- **Services**: http://localhost:3000/services
- **Portfolio**: http://localhost:3000/portfolio
- **Blog**: http://localhost:3000/blog
- **Admin Panel**: http://localhost:3000/admin

## 🔐 **Admin Login**
- **Email**: admin@clickbit.com.au
- **Password**: Admin123!

## 🛠️ **Prerequisites**

Make sure you have installed:
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)

### Install Node.js:
- **Windows/Mac**: Download from [nodejs.org](https://nodejs.org/)
- **Ubuntu/Debian**: `sudo apt install nodejs npm`
- **macOS with Homebrew**: `brew install node`

## 🐛 **If Something Goes Wrong**

### Quick Fixes:
```bash
# Kill any existing processes
pkill -f "node\|react-scripts"

# Re-run the setup
./local-setup-script.sh

# Start fresh
./start-all.sh
```

### Check API Status:
```bash
curl http://localhost:5001/api/health
```

### Check Services Data:
```bash
curl http://localhost:5001/api/services
```

## 💡 **Why This Approach Works Better**

1. **No Port Forwarding**: Direct local access
2. **No Remote Dependencies**: Everything runs on your machine
3. **Faster Development**: No network latency
4. **Better Debugging**: Full access to logs and console
5. **Consistent Environment**: Same setup every time

## 📁 **What You'll Get**

After setup, your project will have:
- `start-all.sh` - Start both servers
- `start-backend.sh` - Start only backend
- `start-frontend.sh` - Start only frontend
- `LOCAL_DEVELOPMENT_GUIDE.md` - Detailed guide
- Proper `.env` files for both frontend and backend

## 🎉 **Expected Result**

Once everything is running:
- ✅ Services page loads 27 services
- ✅ Portfolio page loads 21 portfolio items
- ✅ Blog page loads 22 blog posts
- ✅ Admin panel works with login
- ✅ All API endpoints respond correctly

## 📞 **Need Help?**

If you encounter issues:
1. Check `LOCAL_DEVELOPMENT_GUIDE.md` (created after setup)
2. Verify Node.js/npm versions
3. Check console output for error messages
4. Ensure ports 3000 and 5001 are available

This approach eliminates all the port forwarding complexity and gives you full control over the development environment! 🚀