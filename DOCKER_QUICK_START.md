# Docker Quick Start Guide

## 🚀 Quick Commands

### Start Everything
```bash
docker-compose up -d
```

### Stop Everything
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f server
```

### Rebuild After Changes
```bash
docker-compose up -d --build
```

### Run Database Migrations
```bash
docker exec -it clickbit-server npm run migrate
```

## 📁 File Structure

```
clickbit/
├── client/
│   └── Dockerfile          # Client Dockerfile (optional, uses nginx)
├── server/
│   └── Dockerfile          # Server Dockerfile (main, builds client + server)
├── docker-compose.yml     # Development compose file
├── docker-compose.prod.yml # Production compose file
├── .dockerignore          # Root dockerignore
└── client/.dockerignore   # Client dockerignore
```

## 🔑 Key Points

1. **Server Dockerfile** builds both client and server
2. **Client Dockerfile** is optional (for separate frontend service)
3. **Server serves the built React app** from `client/build/`
4. **Database** runs in a separate container
5. **Volumes** persist data (database, uploads, logs)

## 🐳 For Dockploy

1. Use `server/Dockerfile` as the build file
2. Set context to root directory (`.`)
3. Configure environment variables in Dockploy
4. Set port to `5001`
5. Configure volumes for persistent data

## ⚙️ Environment Variables

Required in `.env`:
- `DB_ROOT_PASSWORD`
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `SMTP_PASS`

See `env.example` for all variables.

