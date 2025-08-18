#!/bin/bash

# ClickBIT Safe Build Script - Prevents VPS Crashes
# This script safely builds the application without consuming excessive memory

echo "🚀 Starting ClickBIT SAFE build process..."
echo "📊 Current system status:"
free -h
echo ""

# Set strict memory limits
export NODE_OPTIONS="--max-old-space-size=512"
export REACT_APP_GA4_MEASUREMENT_ID="G-G2SP59398M"

# Check available memory
AVAILABLE_MEM=$(free -m | awk 'NR==2{printf "%.0f", $7}')
echo "💾 Available memory: ${AVAILABLE_MEM}MB"

# Require minimum 800MB available for safe build
if [ $AVAILABLE_MEM -lt 800 ]; then
    echo "❌ CRITICAL: Only ${AVAILABLE_MEM}MB available. Need at least 800MB for safe build."
    echo "🔄 Freeing up memory..."
    
    # Stop non-essential services
    echo "⏸️  Stopping PM2 processes..."
    pm2 stop all
    
    # Kill TypeScript servers (major memory consumers)
    echo "🔪 Killing TypeScript servers..."
    pkill -f "tsserver" || true
    pkill -f "typescript" || true
    
    # Clear caches
    echo "🧹 Clearing caches..."
    npm cache clean --force
    rm -rf ~/.npm/_cacache
    
    # Wait for memory to free up
    sleep 10
    
    # Check memory again
    AVAILABLE_MEM=$(free -m | awk 'NR==2{printf "%.0f", $7}')
    echo "💾 Memory after cleanup: ${AVAILABLE_MEM}MB"
    
    if [ $AVAILABLE_MEM -lt 800 ]; then
        echo "❌ Still insufficient memory. Aborting build to prevent VPS crash."
        pm2 start all
        exit 1
    fi
fi

echo "✅ Sufficient memory available. Proceeding with build..."

# Create build directory with limited permissions
echo "📁 Preparing build environment..."
cd client
rm -rf build
mkdir -p build

# Build with memory optimization
echo "🔨 Building with memory optimization..."
echo "⚙️  Using NODE_OPTIONS: $NODE_OPTIONS"

# Set environment variables for the build
export CI=false
export GENERATE_SOURCEMAP=false
export INLINE_RUNTIME_CHUNK=false

# Build with reduced memory usage
timeout 1800 npm run build 2>&1 | tee build.log

BUILD_EXIT_CODE=${PIPESTATUS[0]}

# Check build result
if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo "✅ Build completed successfully!"
    
    # Check build size
    BUILD_SIZE=$(du -sh build | cut -f1)
    echo "📦 Build size: $BUILD_SIZE"
    
    # Restart PM2 processes
    echo "🔄 Restarting PM2 processes..."
    cd ..
    pm2 start all
    
    echo "🎉 ClickBIT build and deployment completed!"
    echo "📊 Current PM2 status:"
    pm2 status
    
    # Show memory usage
    echo "📊 Final memory status:"
    free -h
    
else
    echo "❌ Build failed with exit code: $BUILD_EXIT_CODE"
    echo "📋 Build log (last 20 lines):"
    tail -20 build.log
    
    # Restart PM2 processes
    echo "🔄 Restarting PM2 processes..."
    cd ..
    pm2 start all
    
    exit 1
fi
