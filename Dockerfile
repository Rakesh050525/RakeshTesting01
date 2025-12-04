FROM node:20-alpine AS builder
WORKDIR /build

# Build frontend
COPY frontend/package.json frontend/package-lock.json* ./frontend/
COPY frontend ./frontend
WORKDIR /build/frontend
RUN npm ci --silent && npm run build

FROM node:20-alpine
WORKDIR /app

# Copy backend
COPY backend/package.json ./backend/package.json
COPY backend ./backend

# Copy built frontend into expected sibling folder /app/frontend
COPY --from=builder /build/frontend/dist /app/frontend

WORKDIR /app/backend
RUN npm ci --production --silent
EXPOSE 3000
CMD [ "node", "index.js" ]
