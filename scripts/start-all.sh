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
