#!/bin/bash

# ClickBit PM2 Deployment Script
# This script builds the frontend, deploys the application with PM2 (2 clusters),
# and verifies server health and database connection

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home/clickbit"
CLIENT_DIR="$PROJECT_DIR/client"
PORT=${PORT:-5001}
HEALTH_CHECK_URL="http://localhost:${PORT}/api/health"
MAX_RETRIES=5
RETRY_DELAY=3

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

if ! command_exists pm2; then
    print_error "PM2 is not installed. Installing PM2 globally..."
    npm install -g pm2
    if [ $? -ne 0 ]; then
        print_error "Failed to install PM2. Please install it manually: npm install -g pm2"
        exit 1
    fi
    print_success "PM2 installed successfully"
fi

print_success "All prerequisites are met"

# Step 1: Build Frontend
print_status "Step 1: Building frontend..."
cd "$CLIENT_DIR"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
fi

# Build the frontend
print_status "Running frontend build (this may take a few minutes)..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Frontend build failed"
    exit 1
fi

print_success "Frontend built successfully"

# Step 2: Stop existing PM2 processes
print_status "Step 2: Stopping existing PM2 processes..."
cd "$PROJECT_DIR"

# Stop and delete existing clickbit-app processes
pm2 stop clickbit-app 2>/dev/null || true
pm2 delete clickbit-app 2>/dev/null || true

print_success "Existing PM2 processes stopped"

# Step 3: Deploy with PM2 (2 clusters)
print_status "Step 3: Deploying application with PM2 (2 clusters)..."
cd "$PROJECT_DIR"

# Check if ecosystem.config.js exists
if [ ! -f "ecosystem.config.js" ]; then
    print_error "ecosystem.config.js not found"
    exit 1
fi

# Start PM2 with ecosystem config
pm2 start ecosystem.config.js --env production

if [ $? -ne 0 ]; then
    print_error "Failed to start PM2 application"
    exit 1
fi

print_success "Application started with PM2"

# Wait for server to start
print_status "Waiting for server to start (10 seconds)..."
sleep 10

# Step 4: Check PM2 status
print_status "Step 4: Checking PM2 process status..."
pm2 status

# Check if both instances are running
INSTANCE_COUNT=$(pm2 jlist | grep -o '"name":"clickbit-app"' | wc -l)
if [ "$INSTANCE_COUNT" -lt 2 ]; then
    print_warning "Expected 2 instances, but found $INSTANCE_COUNT. Checking logs..."
    pm2 logs clickbit-app --lines 20 --nostream
fi

# Step 5: Check Server Health
print_status "Step 5: Checking server health endpoint..."

RETRY_COUNT=0
HEALTH_CHECK_PASSED=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    print_status "Health check attempt $((RETRY_COUNT + 1))/$MAX_RETRIES..."
    
    # Check if server is responding
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_CHECK_URL" || echo "000")
    
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "503" ]; then
        # Server is responding, get full health check response
        HEALTH_RESPONSE=$(curl -s "$HEALTH_CHECK_URL" || echo "{}")
        
        if [ -n "$HEALTH_RESPONSE" ] && [ "$HEALTH_RESPONSE" != "{}" ]; then
            print_success "Server is responding"
            echo "$HEALTH_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$HEALTH_RESPONSE"
            HEALTH_CHECK_PASSED=true
            break
        fi
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
        print_warning "Health check failed. Retrying in $RETRY_DELAY seconds..."
        sleep $RETRY_DELAY
    fi
done

if [ "$HEALTH_CHECK_PASSED" = false ]; then
    print_error "Server health check failed after $MAX_RETRIES attempts"
    print_status "Checking PM2 logs for errors..."
    pm2 logs clickbit-app --lines 30 --nostream
    exit 1
fi

# Step 6: Check Database Connection
print_status "Step 6: Checking database connection..."

# Extract database status from health check
DB_STATUS=$(echo "$HEALTH_RESPONSE" | grep -o '"healthy":[^,]*' | cut -d':' -f2 | tr -d ' ' || echo "unknown")

if [ "$DB_STATUS" = "true" ]; then
    print_success "Database connection is healthy"
else
    print_warning "Database connection status: $DB_STATUS"
    print_status "Running direct database connection test..."
    
    # Run database connection test script
    cd "$PROJECT_DIR"
    node scripts/test-db-connection.js
    
    if [ $? -eq 0 ]; then
        print_success "Direct database connection test passed"
    else
        print_error "Database connection test failed"
        print_status "Please check your database configuration in .env file"
        exit 1
    fi
fi

# Final Summary
echo ""
print_success "=========================================="
print_success "Deployment completed successfully!"
print_success "=========================================="
echo ""
print_status "PM2 Status:"
pm2 status clickbit-app
echo ""
print_status "Application URLs:"
print_status "  - Health Check: $HEALTH_CHECK_URL"
print_status "  - Server Port: $PORT"
echo ""
print_status "Useful PM2 commands:"
print_status "  - View logs: pm2 logs clickbit-app"
print_status "  - Monitor: pm2 monit"
print_status "  - Restart: pm2 restart clickbit-app"
print_status "  - Stop: pm2 stop clickbit-app"
print_status "  - Status: pm2 status"
echo ""

