module.exports = {
  apps: [
    {
      name: 'clickbit-app',
      script: 'server/index.js',
      instances: 2, // Use 2 instances for better performance
      exec_mode: 'cluster', // Use cluster mode for load balancing
      env: {
        NODE_ENV: 'production',
        PORT: 5001,
        FRONTEND_URL: 'https://clickbit.com.au',
        NODE_OPTIONS: '--max-old-space-size=256 --gc-interval=100 --tls-cipher-list="ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384"'
      },
      // Memory management - optimized for performance
      max_memory_restart: '400M',
      node_args: '--max-old-space-size=256',
      
      // Process management
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Performance optimizations
      instances: 2,
      exec_mode: 'cluster',
      
      // Health checks
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      
      // Load balancing
      load_balancing_method: 'least-connection'
    },
    {
      name: 'rpl-support',
      script: 'server/rpl-support.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=256'
      },
      // Memory management
      max_memory_restart: '400M',
      node_args: '--max-old-space-size=256',
      
      // Process management
      autorestart: true,
      watch: false,
      max_restarts: 5,
      min_uptime: '10s',
      
      // Logging
      log_file: './logs/rpl-support.log',
      out_file: './logs/rpl-support-out.log',
      error_file: './logs/rpl-support-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ],
  
  deploy: {
    production: {
      user: 'root',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'https://github.com/clickbitau/clickbit.git',
      path: '/home/clickbit/clickbit-new-main',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production'
    }
  }
};
