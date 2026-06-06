FROM node:18-alpine AS builder

WORKDIR /app

# Accept build-time env vars (baked into Next.js bundle)
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Production image ──────────────────────────────────────────────────────────
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/.next        ./.next
COPY --from=builder /app/public       ./public
COPY --from=builder /app/next.config.js ./

EXPOSE 3000
CMD ["npm", "start"]
