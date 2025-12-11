# ============================================
# ClickBit Server - Node.js/Express API
# Multi-stage build for production optimization
# ============================================

# Stage 1: Build client and install server dependencies
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy root package files
COPY package*.json ./

# Install root dependencies
RUN npm ci --only=production=false

# Copy client package files
COPY client/package*.json ./client/

# Install client dependencies
RUN cd client && npm ci --only=production=false

# Copy client source
COPY client/ ./client/

# Build client application
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
ENV INLINE_RUNTIME_CHUNK=false
RUN cd client && npm run build

# Stage 2: Production server image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install production dependencies only
RUN apk add --no-cache dumb-init curl

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && \
    npm cache clean --force

# Copy server source code
COPY server/ ./server/

# Copy built client from builder stage
COPY --from=builder /app/client/build ./client/build

# Copy public images directory if it exists
COPY public/ ./public/ 2>/dev/null || true

# Create necessary directories
RUN mkdir -p logs uploads client/public/images/uploads/portfolio \
    client/public/images/uploads/blog client/public/images/uploads/team && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the server
CMD ["node", "server/index.js"]

