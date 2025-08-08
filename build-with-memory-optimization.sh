#!/bin/bash

# ClickBIT Memory-Optimized Build Script
# This script prevents VPS freezes during React builds

echo "🚀 Starting ClickBIT build with memory optimization..."

# Set Node.js memory limits
export NODE_OPTIONS="--max-old-space-size=512"

# Check available memory
echo "📊 Checking system memory..."
free -h

# Stop PM2 processes to free up memory
echo "⏸️  Temporarily stopping PM2 processes..."
pm2 stop all

# Wait for processes to stop
sleep 5

# Clear npm cache
echo "🧹 Clearing npm cache..."
npm cache clean --force

# Remove existing build
echo "🗑️  Removing existing build..."
rm -rf client/build

# Build with memory optimization
echo "🔨 Building ClickBIT client with memory optimization..."
cd client

# Build with reduced memory usage
NODE_OPTIONS="--max-old-space-size=512" npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    
    # Restart PM2 processes
    echo "🔄 Restarting PM2 processes..."
    cd ..
    pm2 start all
    
    echo "🎉 ClickBIT build and deployment completed!"
    echo "📊 Current PM2 status:"
    pm2 status
    
else
    echo "❌ Build failed! Restarting PM2 processes..."
    cd ..
    pm2 start all
    exit 1
fi
