#!/bin/bash

echo "🚀 Starting ClickBit Frontend Server for Network Access..."
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "client/package.json" ]; then
    echo "❌ Error: client/package.json not found. Please run this script from the project root."
    exit 1
fi

# Get local IP address
LOCAL_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -n1)

echo "📋 Network Configuration:"
echo "  - Frontend will be available at:"
echo "    • http://localhost:3000 (local)"
echo "    • http://${LOCAL_IP}:3000 (network)"
echo "  - Backend API: http://${LOCAL_IP}:5001"
echo ""

# Set environment variables for network access
export HOST=0.0.0.0
export PORT=3000
export REACT_APP_API_URL=/api

echo "🔧 Starting React development server..."
echo "   (This will allow access from other devices on your network)"
echo ""

cd client && npm start
