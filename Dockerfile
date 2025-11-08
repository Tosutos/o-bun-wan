# Multi-stage build for Next.js + Prisma (SQLite)

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS builder
WORKDIR /app
COPY . .
# Generate Prisma Client and build Next.js
RUN npx prisma generate && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy node_modules (prod + dev to keep prisma cli available for migrate)
COPY --from=deps /app/node_modules ./node_modules

# Copy built app and required files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Expose and start
EXPOSE 3000
CMD ["/bin/sh", "-c", "npx prisma migrate deploy && npm run start"]

