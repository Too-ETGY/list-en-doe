# Stage 1: Build frontend static bundle
FROM oven/bun:latest AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json ./
COPY frontend/ ./
RUN bun install
RUN bun run build

# Stage 2: Final App Image
FROM oven/bun:latest AS runner
WORKDIR /app

# Copy backend files
COPY backend/package.json ./backend/
WORKDIR /app/backend
COPY backend/ ./
RUN bun install

COPY --from=frontend-builder /app/frontend/build ./public

ENV PORT=3001
ENV STATIC_PATH=/app/backend/public

EXPOSE 3001

RUN chmod +x ./start.sh

CMD ["./start.sh"]
