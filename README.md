# List-en-do

A personal, flexible (notion-like) list management app for tracking movies, anime, books, tasks, and anything else.

## Quick Start

```bash
# Backend
cd backend
cp ../.env.example .env  # Edit with your DB credentials
bun install
bun run db:generate      # Generate migrations
bun run db:migrate       # Run migrations
bun run db:seed          # Seed pre-built templates
bun run dev              # Starts on :3001

# Frontend (separate terminal)
cd frontend
bun install
bun run dev              # Starts on :5173
```

Open `http://localhost:5173`

## Tech Stack

- **Backend**: ElysiaJS (Bun)
- **Frontend**: SvelteKit
- **Database**: PostgreSQL + Drizzle ORM
- **Styling**: Vanilla CSS (dark theme)
