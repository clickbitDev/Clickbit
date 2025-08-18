#!/bin/bash

# ClickBIT Memory Monitor - Prevents VPS Crashes
# Run this script to monitor memory usage and prevent crashes

echo "🔍 ClickBIT Memory Monitor"
echo "=========================="

while true; do
    # Get memory info
    MEMORY_INFO=$(free -m)
    AVAILABLE_MEM=$(echo "$MEMORY_INFO" | awk 'NR==2{printf "%.0f", $7}')
    TOTAL_MEM=$(echo "$MEMORY_INFO" | awk 'NR==2{printf "%.0f", $2}')
    USED_MEM=$(echo "$MEMORY_INFO" | awk 'NR==2{printf "%.0f", $3}')
    USAGE_PERCENT=$((USED_MEM * 100 / TOTAL_MEM))
    
    # Get timestamp
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Display memory status
    echo "[$TIMESTAMP] 💾 Memory: ${USED_MEM}MB/${TOTAL_MEM}MB (${USAGE_PERCENT}%) - Available: ${AVAILABLE_MEM}MB"
    
    # Check for critical memory levels
    if [ $AVAILABLE_MEM -lt 500 ]; then
        echo "⚠️  WARNING: Low memory available (${AVAILABLE_MEM}MB)"
        
        if [ $AVAILABLE_MEM -lt 300 ]; then
            echo "🚨 CRITICAL: Very low memory (${AVAILABLE_MEM}MB). Taking action..."
            
            # Kill TypeScript servers (major memory consumers)
            echo "🔪 Killing TypeScript servers..."
            pkill -f "tsserver" || true
            pkill -f "typescript" || true
            
            # Clear npm cache
            echo "🧹 Clearing npm cache..."
            npm cache clean --force 2>/dev/null || true
            
            # Wait for memory to free up
            sleep 5
            
            # Check memory again
            NEW_AVAILABLE_MEM=$(free -m | awk 'NR==2{printf "%.0f", $7}')
            echo "✅ Memory after cleanup: ${NEW_AVAILABLE_MEM}MB"
        fi
    fi
    
    # Check for high memory usage
    if [ $USAGE_PERCENT -gt 85 ]; then
        echo "⚠️  WARNING: High memory usage (${USAGE_PERCENT}%)"
        
        if [ $USAGE_PERCENT -gt 95 ]; then
            echo "🚨 CRITICAL: Critical memory usage (${USAGE_PERCENT}%)"
            echo "🔄 Restarting PM2 processes to free memory..."
            pm2 restart all
            sleep 10
        fi
    fi
    
    # Show top memory consumers
    if [ $AVAILABLE_MEM -lt 800 ]; then
        echo "📊 Top memory consumers:"
        ps aux --sort=-%mem | head -5 | awk '{printf "  %s: %sMB (%s%%)\n", $11, $6, $4}'
    fi
    
    echo "---"
    
    # Wait 30 seconds before next check
    sleep 30
done
