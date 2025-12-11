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

# Install root dependencies (including dev dependencies for build)
RUN npm install

# Copy client package files
COPY client/package*.json ./client/

# Install client dependencies (including dev dependencies for build)
RUN cd client && npm install

# Copy application code
COPY . .

# Create upload directories with proper permissions BEFORE build
RUN mkdir -p client/public/images/uploads/portfolio \
    client/public/images/uploads/blog \
    client/public/images/uploads/team \
    uploads && \
    chmod -R 755 client/public/images/uploads uploads

# Build client
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
ENV INLINE_RUNTIME_CHUNK=false
RUN cd client && npm run build

# Ensure upload directories exist in build output (for production serving)
RUN mkdir -p client/build/images/uploads/portfolio \
    client/build/images/uploads/blog \
    client/build/images/uploads/team && \
    chmod -R 755 client/build/images/uploads

# Copy public images to build directory (so they're available in production)
RUN cp -r client/public/images/* client/build/images/ 2>/dev/null || true

# Install production dependencies only
RUN (npm ci --omit=dev || npm install --production) && npm cache clean --force

# Expose port
EXPOSE 5001

# Start the application
CMD ["node", "server/index.js"] 