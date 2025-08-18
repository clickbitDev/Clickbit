#!/bin/bash

echo "🚀 ClickBit Local Setup Script"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js is installed: $NODE_VERSION"
        return 0
    else
        print_error "Node.js is not installed. Please install Node.js 16+ and try again."
        return 1
    fi
}

# Check if npm is installed
check_npm() {
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_status "npm is installed: $NPM_VERSION"
        return 0
    else
        print_error "npm is not installed. Please install npm and try again."
        return 1
    fi
}

# Kill any existing processes
cleanup_processes() {
    print_info "Cleaning up existing processes..."
    pkill -f "react-scripts" 2>/dev/null || true
    pkill -f "node.*index.js" 2>/dev/null || true
    pkill -f "npm start" 2>/dev/null || true
    sleep 2
    print_status "Cleanup completed"
}

# Install dependencies
install_dependencies() {
    print_info "Installing backend dependencies..."
    cd server
    if npm install; then
        print_status "Backend dependencies installed"
    else
        print_error "Failed to install backend dependencies"
        return 1
    fi
    
    cd ../client
    print_info "Installing frontend dependencies..."
    if npm install; then
        print_status "Frontend dependencies installed"
    else
        print_error "Failed to install frontend dependencies"
        return 1
    fi
    cd ..
}

# Create environment file
create_env_file() {
    print_info "Creating environment configuration..."
    
    # Create backend .env
    cat > server/.env << EOF
NODE_ENV=development
PORT=5001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clickbit
DB_USER=postgres
DB_PASS=password
JWT_SECRET=your-super-secret-jwt-key-here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EOF

    # Create frontend .env
    cat > client/.env << EOF
REACT_APP_API_URL=http://localhost:5001/api
GENERATE_SOURCEMAP=false
BROWSER=none
EOF

    print_status "Environment files created"
}

# Initialize database
setup_database() {
    print_info "Setting up database..."
    cd server
    if node scripts/initDatabase.js; then
        print_status "Database initialized"
    else
        print_warning "Database setup had issues (this might be normal)"
    fi
    cd ..
}

# Create startup scripts
create_startup_scripts() {
    print_info "Creating startup scripts..."
    
    # Backend startup script
    cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🔧 Starting ClickBit Backend Server..."
cd server
PORT=5001 node index.js
EOF

    # Frontend startup script
    cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🎨 Starting ClickBit Frontend..."
cd client
REACT_APP_API_URL=http://localhost:5001/api npm start
EOF

    # Combined startup script
    cat > start-all.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting ClickBit Full Stack Application..."

# Function to handle cleanup
cleanup() {
    echo "Shutting down servers..."
    pkill -f "node.*index.js" 2>/dev/null
    pkill -f "react-scripts" 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend in background
echo "Starting backend server..."
cd server
PORT=5001 node index.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Check if backend is running
if curl -s http://localhost:5001/api/health > /dev/null; then
    echo "✅ Backend server started successfully on port 5001"
else
    echo "❌ Backend server failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start frontend
echo "Starting frontend server..."
cd ../client
REACT_APP_API_URL=http://localhost:5001/api npm start &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
EOF

    # Make scripts executable
    chmod +x start-backend.sh
    chmod +x start-frontend.sh
    chmod +x start-all.sh
    
    print_status "Startup scripts created"
}

# Create development guide
create_dev_guide() {
    cat > LOCAL_DEVELOPMENT_GUIDE.md << 'EOF'
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
EOF

    print_status "Development guide created"
}

# Main execution
main() {
    echo ""
    print_info "Starting ClickBit local setup..."
    echo ""
    
    # Check prerequisites
    if ! check_node || ! check_npm; then
        exit 1
    fi
    
    # Setup steps
    cleanup_processes
    install_dependencies
    create_env_file
    setup_database
    create_startup_scripts
    create_dev_guide
    
    echo ""
    print_status "🎉 Setup completed successfully!"
    echo ""
    print_info "Next steps:"
    echo "1. Run: ./start-all.sh"
    echo "2. Open: http://localhost:3000"
    echo "3. Check: LOCAL_DEVELOPMENT_GUIDE.md for details"
    echo ""
    print_warning "If you encounter issues, check the troubleshooting section in LOCAL_DEVELOPMENT_GUIDE.md"
}

# Run main function
main "$@"