# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Add bash/libc6-compat if needed by any native dependencies later (optional, commented out)
# RUN apk add --no-cache libc6-compat git python3 make g++

# Copy dependency files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Set node environment to production
ENV NODE_ENV=production

# Copy dependency files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the compiled output from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the application port (matching APP_PORT in .env)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
