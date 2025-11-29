#!/usr/bin/env node

/**
 * Server Health Check Script
 * Checks the health status of the Clickbit server
 */

const http = require('http');

const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || 'localhost';
const HEALTH_ENDPOINT = `http://${HOST}:${PORT}/api/health`;

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

function checkHealth() {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const req = http.get(HEALTH_ENDPOINT, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        
        try {
          const health = JSON.parse(data);
          resolve({
            success: true,
            statusCode: res.statusCode,
            responseTime,
            health,
          });
        } catch (error) {
          reject(new Error(`Failed to parse health check response: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Health check request failed: ${error.message}`));
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Health check request timed out after 5 seconds'));
    });
  });
}

async function main() {
  console.log(`${colors.cyan}╔════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║         Clickbit Server Health Check                ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  console.log(`${colors.blue}Checking server at: ${HEALTH_ENDPOINT}${colors.reset}\n`);
  
  try {
    const result = await checkHealth();
    const { health, statusCode, responseTime } = result;
    
    // Overall Status
    const isHealthy = health.status === 'OK' && health.database?.healthy;
    const statusColor = isHealthy ? colors.green : colors.red;
    const statusIcon = isHealthy ? '✓' : '✗';
    
    console.log(`${statusColor}${statusIcon} Overall Status: ${health.status}${colors.reset}`);
    console.log(`${colors.blue}Response Time: ${responseTime}ms${colors.reset}`);
    console.log(`${colors.blue}HTTP Status: ${statusCode}${colors.reset}\n`);
    
    // Server Information
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.cyan}Server Information${colors.reset}`);
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`Environment: ${health.environment || 'N/A'}`);
    console.log(`Version: ${health.version || 'N/A'}`);
    console.log(`Process ID: ${health.server?.pid || 'N/A'}`);
    console.log(`Uptime: ${formatUptime(health.server?.uptime || 0)}`);
    console.log(`Timestamp: ${health.timestamp || 'N/A'}\n`);
    
    // Database Status
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.cyan}Database Status${colors.reset}`);
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    if (health.database) {
      const dbHealthy = health.database.healthy;
      const dbColor = dbHealthy ? colors.green : colors.red;
      const dbIcon = dbHealthy ? '✓' : '✗';
      
      console.log(`${dbColor}${dbIcon} Status: ${dbHealthy ? 'Healthy' : 'Unhealthy'}${colors.reset}`);
      console.log(`Last Check: ${new Date(health.database.lastCheck).toLocaleString()}`);
      console.log(`Failure Count: ${health.database.failureCount || 0}`);
      if (health.database.uptime > 0) {
        console.log(`Uptime: ${formatUptime(health.database.uptime / 1000)}`);
      }
    } else {
      console.log(`${colors.yellow}⚠ Database status not available${colors.reset}`);
    }
    console.log();
    
    // Memory Usage
    if (health.server?.memory) {
      const mem = health.server.memory;
      console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
      console.log(`${colors.cyan}Memory Usage${colors.reset}`);
      console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
      console.log(`RSS: ${formatBytes(mem.rss || 0)}`);
      console.log(`Heap Total: ${formatBytes(mem.heapTotal || 0)}`);
      console.log(`Heap Used: ${formatBytes(mem.heapUsed || 0)}`);
      console.log(`External: ${formatBytes(mem.external || 0)}`);
      
      if (mem.heapTotal > 0) {
        const heapUsagePercent = ((mem.heapUsed / mem.heapTotal) * 100).toFixed(2);
        const heapColor = heapUsagePercent > 80 ? colors.red : heapUsagePercent > 60 ? colors.yellow : colors.green;
        console.log(`Heap Usage: ${heapColor}${heapUsagePercent}%${colors.reset}`);
      }
      console.log();
    }
    
    // Summary
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    if (isHealthy) {
      console.log(`${colors.green}✓ Server is healthy and operational${colors.reset}`);
      process.exit(0);
    } else {
      console.log(`${colors.red}✗ Server is experiencing issues${colors.reset}`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error(`${colors.red}✗ Health check failed: ${error.message}${colors.reset}`);
    console.error(`\n${colors.yellow}Troubleshooting:${colors.reset}`);
    console.error(`1. Ensure the server is running on port ${PORT}`);
    console.error(`2. Check if the server is accessible at ${HEALTH_ENDPOINT}`);
    console.error(`3. Review server logs for errors`);
    process.exit(1);
  }
}

// Run the health check
main();

