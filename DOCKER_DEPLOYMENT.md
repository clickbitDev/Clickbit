# Docker Deployment Guide for ClickBit

This guide explains how to deploy ClickBit using Docker and Docker Compose, optimized for Dockploy.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB RAM available
- 10GB free disk space

## 🏗️ Architecture

The Docker setup consists of:

1. **MySQL Database** - Stores application data
2. **Node.js/Express Server** - API server that also serves the built React app
3. **React Client** - Built and served by the server (optional separate service)

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Edit `.env` with your production values:

```env
# Database Configuration
DB_ROOT_PASSWORD=your_secure_root_password
DB_NAME=clickbitdb
DB_USER=clickbit_user
DB_PASSWORD=your_secure_password
DB_PORT=3306

# Server Configuration
SERVER_PORT=5001
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# Frontend URL
FRONTEND_URL=https://clickbit.com.au

# Email Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@clickbit.com.au
SMTP_PASS=your_email_password
FROM_EMAIL=contact@clickbit.com.au

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

### 2. Build and Start Services

**Development/Testing:**
```bash
docker-compose up -d
```

**Production:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Run Database Migrations

After the database is ready, run migrations:

```bash
# Enter the server container
docker exec -it clickbit-server bash

# Run migrations
npm run migrate

# (Optional) Seed initial data
npm run seed
```

Or run migrations from host:

```bash
docker exec -it clickbit-server npm run migrate
```

### 4. Verify Deployment

Check service status:
```bash
docker-compose ps
```

Check logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f db
```

Health checks:
```bash
# Server health
curl http://localhost:5001/api/health

# Database health
docker exec -it clickbit-db mysqladmin ping -h localhost -u root -p
```

## 📦 Docker Services

### Database Service (`db`)

- **Image**: `mysql:8.0`
- **Port**: `3306` (internal only in production)
- **Volume**: `mysql_data` (persistent storage)
- **Health Check**: MySQL ping

### Server Service (`server`)

- **Build**: Multi-stage build from `server/Dockerfile`
- **Port**: `5001`
- **Volumes**:
  - `./logs` - Application logs
  - `./uploads` - Uploaded files
  - `./client/public/images/uploads` - Image uploads
- **Health Check**: HTTP GET `/api/health`

## 🔧 Configuration

### Environment Variables

All environment variables are loaded from `.env` file. Key variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_ROOT_PASSWORD` | MySQL root password | Yes |
| `DB_NAME` | Database name | Yes |
| `DB_USER` | Database user | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `STRIPE_SECRET_KEY` | Stripe API secret key | Yes |
| `SMTP_PASS` | Email password | Yes |

### Port Configuration

Default ports (can be changed in `.env`):

- **Server**: `5001`
- **Database**: `3306` (internal only)

### Volume Management

Persistent volumes:

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect clickbit_mysql_data

# Backup database
docker exec clickbit-db mysqldump -u root -p clickbitdb > backup.sql

# Restore database
docker exec -i clickbit-db mysql -u root -p clickbitdb < backup.sql
```

## 🐳 Dockploy Deployment

### For Dockploy Platform

1. **Connect Repository**: Link your GitHub repository to Dockploy

2. **Configure Build**:
   - **Dockerfile Path**: `server/Dockerfile`
   - **Context**: Root directory (`.`)
   - **Build Command**: (auto-detected)

3. **Environment Variables**: Add all variables from `.env` in Dockploy's environment settings

4. **Port Configuration**:
   - **Container Port**: `5001`
   - **Public Port**: (configured in Dockploy)

5. **Database**: 
   - Use Dockploy's managed database service OR
   - Configure external database connection

6. **Volumes**: Configure persistent volumes for:
   - `/app/logs`
   - `/app/uploads`
   - `/app/client/public/images/uploads`

### Dockploy-Specific Configuration

If using Dockploy's managed services:

```yaml
# Update docker-compose.yml for Dockploy
services:
  server:
    # Remove db service if using Dockploy's database
    environment:
      DB_HOST: ${DOCKPLOY_DB_HOST}  # Provided by Dockploy
      DB_PORT: ${DOCKPLOY_DB_PORT}
      DB_NAME: ${DOCKPLOY_DB_NAME}
      DB_USER: ${DOCKPLOY_DB_USER}
      DB_PASSWORD: ${DOCKPLOY_DB_PASSWORD}
```

## 🔄 Maintenance

### Update Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up -d --build

# Or for production
docker-compose -f docker-compose.prod.yml up -d --build
```

### View Logs

```bash
# All services
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs -f server
```

### Stop Services

```bash
# Stop (keeps containers)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v
```

### Backup

```bash
# Backup database
docker exec clickbit-db mysqldump -u root -p${DB_ROOT_PASSWORD} ${DB_NAME} > backup-$(date +%Y%m%d).sql

# Backup uploads
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/ client/public/images/uploads/
```

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs server

# Check container status
docker-compose ps

# Restart service
docker-compose restart server
```

### Database Connection Issues

```bash
# Check database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Test connection from server container
docker exec -it clickbit-server node -e "require('./server/config/database.js')"
```

### Build Failures

```bash
# Clean build (no cache)
docker-compose build --no-cache

# Check build logs
docker-compose build 2>&1 | tee build.log
```

### Port Conflicts

```bash
# Check what's using the port
lsof -i :5001

# Change port in docker-compose.yml
ports:
  - "5002:5001"  # Host:Container
```

### Permission Issues

```bash
# Fix upload directory permissions
sudo chown -R $USER:$USER uploads/
sudo chown -R $USER:$USER client/public/images/uploads/
```

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use strong passwords** - Generate secure random passwords
3. **Rotate secrets regularly** - Update JWT_SECRET and database passwords
4. **Limit database access** - Database port not exposed in production
5. **Use HTTPS** - Configure reverse proxy (Nginx) in front of Docker
6. **Regular updates** - Keep Docker images updated
7. **Backup regularly** - Automated backups for database and uploads

## 📊 Monitoring

### Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# Manual health check
curl http://localhost:5001/api/health
```

### Resource Usage

```bash
# Container stats
docker stats

# Specific container
docker stats clickbit-server
```

## 🚀 Production Checklist

- [ ] All environment variables configured
- [ ] Strong passwords set
- [ ] Database migrations run
- [ ] SSL/HTTPS configured (via reverse proxy)
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Log rotation configured
- [ ] Resource limits set
- [ ] Health checks passing
- [ ] Security headers verified

## 📝 Notes

- The server serves the built React app from `client/build/`
- Database data persists in Docker volumes
- Uploads are stored in mounted volumes
- Logs are stored in `./logs` directory
- Health checks ensure services are running correctly

---

**Last Updated**: 2025-01-22
**Version**: 1.0.0

