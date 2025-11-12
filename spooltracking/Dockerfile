# Stage 1: Build the Angular application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Node.js server
FROM node:20-alpine

WORKDIR /app

# Install http-server globally
RUN npm install -g http-server

# Copy built application from builder stage
COPY --from=builder /app/dist/spooltracking/browser ./dist

# Copy config-generator script
COPY config-generator.js ./

# Expose port
EXPOSE 4200

# Default environment variables
ENV API_HOST=localhost
ENV API_PORT=5000

# Generate config and start server
CMD ["sh", "-c", "node config-generator.js && http-server ./dist -p 4200 --cors -g"]
