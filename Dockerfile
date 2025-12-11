# This Dockerfile is deprecated - use server/Dockerfile instead
# For Docker Compose, use docker-compose.yml which uses server/Dockerfile
# For standalone builds, use: docker build -f server/Dockerfile .

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy package files
COPY package*.json ./

# Install root dependencies
RUN npm ci --only=production=false

# Copy client package files
COPY client/package*.json ./client/

# Install client dependencies
RUN cd client && npm ci --only=production=false

# Copy application code
COPY . .

# Build client
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
ENV INLINE_RUNTIME_CHUNK=false
RUN cd client && npm run build

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Expose port
EXPOSE 5001

# Start the application
CMD ["node", "server/index.js"] 