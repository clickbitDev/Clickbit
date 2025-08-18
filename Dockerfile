FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy client package files
COPY client/package*.json ./client/

# Install client dependencies
RUN cd client && npm install

# Copy application code
COPY . .

# Build client
RUN cd client && npm run build

# Expose port
EXPOSE 5001

# Start the application
CMD ["npm", "start"] 