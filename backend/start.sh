#!/bin/sh
set -e

echo "Running database migrations..."
bun run db:migrate || true

echo "Seeding initial database templates..."
bun run db:seed || true

echo "Starting List-en-do server on port 3001..."
exec bun run src/index.ts
