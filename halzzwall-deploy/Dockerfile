# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files first for layer caching
COPY package.json ./
# Delete pnpm lockfile if it exists — we use npm
RUN rm -f pnpm-lock.yaml

# Install ALL deps (including devDeps needed for vite build)
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Build the frontend
RUN npm run build

# ─── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Only install production server deps
COPY package-server.json ./package.json
RUN npm install --legacy-peer-deps --omit=dev

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Copy server files
COPY server.js masqr.js encryption.js error-handler.js ./

# Fly.io uses port 8080 internally
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "server.js"]
