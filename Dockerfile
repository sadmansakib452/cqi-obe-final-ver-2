# Stage 1: Base setup with Node 21
FROM node:21-alpine as base

WORKDIR /app

# Set environment variable to skip native build for argon2
ENV ARGON2_BROWSER=1

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Install build tools to compile native binaries for argon2 (if needed)
RUN apk add --no-cache build-base python3 && npm rebuild argon2

# Stage 2: Build the Next.js app
FROM base as builder

WORKDIR /app
COPY . ./

# Generate Prisma Client
RUN npm run prisma:generate

# Build the Next.js app
RUN npm run build

# Stage 3: Runner (Node.js for serving the app)
FROM node:21-alpine as runner

WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

# Create a user for Next.js application
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set ownership for Next.js user and fix file permissions
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next/cache

# Use non-root user
USER nextjs

EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]
