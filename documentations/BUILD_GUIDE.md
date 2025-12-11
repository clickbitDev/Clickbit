# 🚀 ClickBIT Safe Build Guide

## 🚨 VPS Crash Prevention

Your VPS has **3.8GB RAM** which is insufficient for standard React builds. This guide prevents crashes.

## 📋 Prerequisites

### 1. Add to your `.env` file:
```bash
# Google Analytics 4
GA4_MEASUREMENT_ID=G-G2SP59398M
REACT_APP_GA4_MEASUREMENT_ID=G-G2SP59398M

# Memory Optimization
NODE_OPTIONS=--max-old-space-size=512
```

### 2. Check available memory:
```bash
free -h
# Need at least 800MB available for safe build
```

## 🔧 Safe Build Methods

### Method 1: Safe Build Script (Recommended)
```bash
./build-safe.sh
```

### Method 2: Manual Memory-Optimized Build
```bash
# Stop PM2 processes
pm2 stop all

# Kill TypeScript servers (major memory consumers)
pkill -f "tsserver"
pkill -f "typescript"

# Clear caches
npm cache clean --force

# Set memory limits
export NODE_OPTIONS="--max-old-space-size=512"
export REACT_APP_GA4_MEASUREMENT_ID="G-G2SP59398M"

# Build with optimizations
cd client
CI=false GENERATE_SOURCEMAP=false npm run build

# Restart PM2
cd ..
pm2 start all
```

### Method 3: PM2 Ecosystem (Production)
```bash
# Use the ecosystem config
pm2 start ecosystem.config.js

# For deployment
pm2 deploy production
```

## 🧹 Memory Cleanup Before Build

### Kill Memory-Hungry Processes:
```bash
# TypeScript servers (consumes 400MB+)
pkill -f "tsserver"
pkill -f "typescript"

# Clear npm cache
npm cache clean --force
rm -rf ~/.npm/_cacache

# Stop non-essential services
pm2 stop all
```

### Wait for Memory to Free:
```bash
# Monitor memory
watch -n 5 'free -h'

# Wait until available memory > 800MB
```

## 📊 Memory Monitoring

### Run Memory Monitor:
```bash
./monitor-memory.sh
```

### Check Memory Usage:
```bash
# Real-time memory
htop

# Memory by process
ps aux --sort=-%mem | head -10

# Available memory
free -h
```

## ⚠️ Warning Signs

- **Available memory < 500MB**: Warning
- **Available memory < 300MB**: Critical - take action
- **Memory usage > 85%**: Warning
- **Memory usage > 95%**: Critical - restart services

## 🚀 Build Process

### 1. Pre-Build Checklist:
- [ ] Available memory > 800MB
- [ ] TypeScript servers killed
- [ ] PM2 processes stopped
- [ ] NPM cache cleared
- [ ] Environment variables set

### 2. Build Commands:
```bash
# Set memory limits
export NODE_OPTIONS="--max-old-space-size=512"

# Build with optimizations
cd client
CI=false GENERATE_SOURCEMAP=false npm run build
```

### 3. Post-Build:
- [ ] Verify build success
- [ ] Check build size
- [ ] Restart PM2 processes
- [ ] Monitor memory usage

## 🔍 Troubleshooting

### Build Fails:
```bash
# Check build logs
tail -50 client/build.log

# Check memory
free -h

# Restart with more memory cleanup
./build-safe.sh
```

### VPS Still Crashes:
1. **Increase swap space** (if possible)
2. **Upgrade VPS RAM** (recommended)
3. **Use external build service** (GitHub Actions, Netlify)
4. **Build locally** and upload

## 📈 Performance Tips

### For Low-Memory VPS:
- Use `--max-old-space-size=512` (512MB limit)
- Disable source maps: `GENERATE_SOURCEMAP=false`
- Set `CI=false` to skip tests
- Use `INLINE_RUNTIME_CHUNK=false`
- Build during low-traffic hours

### Long-term Solutions:
- **Upgrade VPS RAM** to 8GB+
- **Use external build services**
- **Implement CI/CD with GitHub Actions**
- **Use Docker with memory limits**

## 🆘 Emergency Recovery

If VPS becomes unresponsive:
```bash
# SSH from another location
ssh root@your-vps-ip

# Kill all Node processes
pkill -f "node"

# Restart PM2
pm2 start all

# Check system status
htop
free -h
```

## 📞 Support

- **Memory issues**: Run `./monitor-memory.sh`
- **Build failures**: Check `./build-safe.sh` logs
- **VPS crashes**: Follow emergency recovery steps
- **Performance**: Consider VPS upgrade

---

**Remember**: Always check available memory before building!
