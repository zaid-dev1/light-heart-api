# ─────────────────────────────────────────
# Stage 1 — Builder
# ─────────────────────────────────────────
FROM node:18-alpine AS builder

# Install build tools
RUN apk add --no-cache python3 make g++

# Set working dir
WORKDIR /usr/src/app

# Copy package manifests and install all deps
COPY package.json package-lock.json* ./
RUN npm ci

# Copy tsconfig and nest config
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Copy source files
COPY src ./src

# Build the app
RUN npm run build

# ─────────────────────────────────────────
# Stage 2 — Production Image
# ─────────────────────────────────────────
FROM node:18-alpine AS runner

# Create app directory
WORKDIR /usr/src/app

# Copy only package manifests and install prod deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy built output from builder
COPY --from=builder /usr/src/app/dist ./dist

# Expose your app port
EXPOSE 3000

# Use a non‑root user
RUN addgroup -S nest && adduser -S nest -G nest
USER nest

# Default command
CMD ["node", "dist/main"]
