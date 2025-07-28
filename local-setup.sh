#!/bin/bash

# ClickBit Website - Local Setup Script
# This script will set up and start the ClickBit website on your local machine

echo "🚀 ClickBit Website - Local Setup Starting..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Pull latest changes
echo ""
echo "🔄 Pulling latest changes from Git..."
git pull origin cursor/check-clickbit-website-files-7cdb

if [ $? -ne 0 ]; then
    echo "⚠️  Git pull failed. Make sure you're in the correct directory and have Git access."
    echo "   Try running: git checkout cursor/check-clickbit-website-files-7cdb"
    exit 1
fi

echo "✅ Git pull completed"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Backend dependency installation failed"
    exit 1
fi

echo "✅ Backend dependencies installed"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd client
npm install

if [ $? -ne 0 ]; then
    echo "❌ Frontend dependency installation failed"
    exit 1
fi

cd ..
echo "✅ Frontend dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  Creating .env file..."
    cp env.example .env
    echo "✅ .env file created from env.example"
    echo "⚠️  Please update .env file with your local settings if needed"
else
    echo "✅ .env file already exists"
fi

# Kill any existing processes on ports 3000 and 5001
echo ""
echo "🔧 Checking for existing processes..."

# Check if kill-port is available, if not install it
if ! command -v npx &> /dev/null; then
    echo "Installing kill-port utility..."
    npm install -g kill-port
fi

# Kill existing processes
npx kill-port 3000 2>/dev/null || true
npx kill-port 5001 2>/dev/null || true

echo "✅ Ports cleared"

# Create start script
echo ""
echo "📝 Creating start script..."
cat > start-servers.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting ClickBit Website Servers..."
echo "======================================"

# Function to start backend
start_backend() {
    echo "🔧 Starting backend server on port 5001..."
    npm start
}

# Function to start frontend  
start_frontend() {
    echo "🌐 Starting frontend server on port 3000..."
    cd client
    npm start
}

# Check if we should start both or just one
if [ "$1" = "backend" ]; then
    start_backend
elif [ "$1" = "frontend" ]; then
    start_frontend
else
    echo "Choose an option:"
    echo "1. Start backend only"
    echo "2. Start frontend only" 
    echo "3. Start both (requires 2 terminals)"
    echo ""
    read -p "Enter choice (1-3): " choice
    
    case $choice in
        1)
            start_backend
            ;;
        2)
            start_frontend
            ;;
        3)
            echo ""
            echo "🎯 To start both servers:"
            echo ""
            echo "Terminal 1 (Backend):"
            echo "   ./start-servers.sh backend"
            echo ""
            echo "Terminal 2 (Frontend):"
            echo "   ./start-servers.sh frontend"
            echo ""
            echo "Or run them manually:"
            echo "Terminal 1: npm start"
            echo "Terminal 2: cd client && npm start"
            ;;
        *)
            echo "Invalid choice"
            exit 1
            ;;
    esac
fi
EOF

chmod +x start-servers.sh
echo "✅ Start script created: start-servers.sh"

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "🚀 To start the website:"
echo ""
echo "Option 1 - Use the start script:"
echo "   ./start-servers.sh"
echo ""
echo "Option 2 - Manual start (recommended):"
echo "   Terminal 1: npm start              (backend)"
echo "   Terminal 2: cd client && npm start (frontend)"
echo ""
echo "🌐 Once both servers are running:"
echo "   Website: http://localhost:3000"
echo "   Admin:   http://localhost:3000/admin"
echo "   API:     http://localhost:5001/api/health"
echo ""
echo "✅ All fixes included:"
echo "   • No infinite loading"
echo "   • Team images working"
echo "   • File organization improved"
echo "   • API endpoints functional"
echo ""
echo "🎯 Ready to use! Happy coding! 🚀"