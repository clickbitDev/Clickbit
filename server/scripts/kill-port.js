#!/usr/bin/env node

const { exec } = require('child_process');

const PORT = process.env.PORT || 5001;

const killPort = (port) => {
  const platform = process.platform;
  let command;

  if (platform === 'win32') {
    // Windows
    command = `netstat -ano | findstr :${port} | findstr LISTENING`;
    exec(command, (error, stdout) => {
      if (error || !stdout) {
        console.log(`No process found on port ${port}`);
        return;
      }
      
      const lines = stdout.trim().split('\n');
      const pids = new Set();
      
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(pid)) {
          pids.add(pid);
        }
      });
      
      pids.forEach(pid => {
        exec(`taskkill /F /PID ${pid}`, (killError) => {
          if (killError) {
            console.error(`Error killing process ${pid}:`, killError.message);
          } else {
            console.log(`Killed process ${pid} on port ${port}`);
          }
        });
      });
    });
  } else {
    // macOS and Linux
    command = `lsof -ti:${port}`;
    exec(command, (error, stdout) => {
      if (error || !stdout) {
        console.log(`No process found on port ${port}`);
        return;
      }
      
      const pids = stdout.trim().split('\n').filter(pid => pid);
      
      pids.forEach(pid => {
        exec(`kill -9 ${pid}`, (killError) => {
          if (killError) {
            console.error(`Error killing process ${pid}:`, killError.message);
          } else {
            console.log(`Killed process ${pid} on port ${port}`);
          }
        });
      });
    });
  }
};

console.log(`Checking for processes on port ${PORT}...`);
killPort(PORT);

// Also kill common development ports
if (process.argv.includes('--all')) {
  setTimeout(() => {
    console.log('Checking other common ports...');
    [3000, 3001, 5000, 5001, 8080].forEach(port => {
      if (port !== PORT) {
        killPort(port);
      }
    });
  }, 1000);
}