# List-en-do — Comprehensive Project Documentation

List-en-do is a personalized, ultra-flexible list and task management web application. It is designed to track anything — movie watchlists, anime watchlists, reading lists, task trackers, or custom lists — with customizable schema fields, custom status workflows, and dynamic layout rendering.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: SvelteKit (Svelte 5 runes mode) compiled to a static Single-Page Application (`@sveltejs/adapter-static`). Styled with Vanilla CSS following a dark Notion/Linear aesthetic.
- **Backend**: ElysiaJS running on Bun. Serves both the RESTful API endpoints under `/api/*` and the static frontend SPA with SPA fallback routing.
- **Database**: PostgreSQL managed with Drizzle ORM (`drizzle-kit`).
  - **Schema Approach**: Hybrid relational model for core fields (title, status, priority, due date) combined with `custom_fields` JSONB for dynamic per-list properties.
- **Containerization**: Single-container Docker setup (`Dockerfile` + `docker-compose.yml`) running on port **`8765`** (`http://localhost:8765`) connected to host PostgreSQL (`host.docker.internal`). Configured with `restart: unless-stopped` for automatic background startup on laptop boot.

---

## 📐 Database Schema

```mermaid
erDiagram
    lists ||--o{ items : "contains"
    items ||--o{ item_tags : "has"
    tags ||--o{ item_tags : "applied to"

    lists {
        uuid id PK
        string name
        string icon
        string template_type
        jsonb field_definitions
        jsonb status_options
        int sort_order
        timestamp created_at
        timestamp updated_at
    }

    items {
        uuid id PK
        uuid list_id FK
        string title
        string status
        string priority
        string image_url
        int progress_current
        int progress_total
        date due_date
        jsonb custom_fields
        timestamp created_at
        timestamp updated_at
    }

    tags {
        uuid id PK
        string name
        string color
    }

    item_tags {
        uuid item_id PK, FK
        uuid tag_id PK, FK
    }
```

---

## 🔌 API Endpoints Reference

### 1. Lists (`/api/lists`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/lists` | Fetch all lists ordered by `sort_order` |
| `POST` | `/api/lists` | Create a new list (accepts template or custom fields & status options) |
| `GET` | `/api/lists/:id` | Fetch single list by ID |
| `PUT` | `/api/lists/:id` | Update list metadata (name, icon, status options, field definitions) |
| `DELETE` | `/api/lists/:id` | Delete a list and all associated items |
| `PUT` | `/api/lists/reorder` | Update `sort_order` for multiple lists |

### 2. Items (`/api/lists/:id/items` & `/api/items/:id`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/lists/:id/items` | Fetch items for a list (supports `search`, `status`, `priority`, `sort`, `order` query params) |
| `POST` | `/api/lists/:id/items` | Create a new item in a list |
| `PUT` | `/api/items/:id` | Update an existing item |
| `DELETE` | `/api/items/:id` | Delete an item |
| `PATCH` | `/api/items/:id/status` | Quick update item status |
| `PATCH` | `/api/items/:id/progress` | Quick update item progress (`progress_current`, `progress_total`) |

### 3. Tags (`/api/tags`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tags` | Fetch all tags |
| `POST` | `/api/tags` | Create a tag |
| `DELETE` | `/api/tags/:id` | Delete a tag |
| `POST` | `/api/items/:itemId/tags` | Attach tag to an item |
| `DELETE` | `/api/items/:itemId/tags/:tagId` | Detach tag from an item |

---

## 🎨 Frontend Architecture & Components

- **`src/app.css`**: Design tokens for Notion/Linear dark theme (`--bg-primary`, `--bg-secondary`, `--accent`, `--border`, etc.).
- **`src/routes/+layout.svelte`**: Global app layout embedding `Sidebar.svelte` and main page content area. Imports `app.css`.
- **`src/lib/stores.svelte.ts`**: Reactive state management rune class `ListStore` handling lists, active list, items, tags, loading state, and CRUD operations.
- **`src/lib/components/Sidebar.svelte`**: Left navigation bar showing all user lists, hover `⚙️` gear button for list settings, and "+ New List" trigger.
- **`src/lib/components/ListTable.svelte`**: Dynamic data table displaying columns (`Cover`, `Title`, `Status`, `Priority`, `Tags`, `Progress`, `Due Date`, and dynamic custom fields). Dynamically passes `hasProgress` prop to prevent column shift.
- **`src/lib/components/ItemRow.svelte`**: Individual table row component with status dropdown badge, priority badge, tags, progress bar, and custom field values.
- **`src/lib/components/CreateListModal.svelte`**: Modal overlay for creating lists. Provides pre-built templates (`Movie`, `Anime`, `Book`, `Task`) or custom field builder with custom status options and emoji picker.
- **`src/lib/components/EditListModal.svelte`**: Modal overlay for editing list settings (rename, icon change, status options editor, custom field definition editor, and list deletion with reactive navigation). Safe against Svelte 5 Proxy clone errors.
- **`src/lib/components/ItemModal.svelte`**: Modal overlay for creating or editing item details, status, priority, due date, progress tracking, image URL preview, and list custom properties.

---

## 🐳 Docker Deployment Setup

### Access Configuration
- **Access URL**: `http://localhost:8765`
- **Port**: `8765` (mapped to internal `3001`)
- **Auto-Start**: `restart: unless-stopped` in `docker-compose.yml`

### Docker Files Structure
1. **`Dockerfile`**: Multi-stage build using `oven/bun:latest`:
   - **Stage 1 (`frontend-builder`)**: Installs frontend dependencies and runs `bun run build` (`@sveltejs/adapter-static` output to `frontend/build`).
   - **Stage 2 (`runner`)**: Copies backend source, installs production packages, copies static build into `/app/backend/public`, and executes `start.sh`.
2. **`docker-compose.yml`**:
   - Maps host port `8765:3001`.
   - Uses `extra_hosts: ["host.docker.internal:host-gateway"]` to connect to host PostgreSQL server (`postgresql://postgres:123123@host.docker.internal:5432/listendo`).
3. **`backend/start.sh`**:
   - Automatically executes `bun run db:migrate` and `bun run db:seed` on container startup before running `bun run src/index.ts`.

---

## 💻 Developer Quickstart Guide

### Running Locally (Without Docker)
1. **Backend**:
   ```bash
   cd backend
   bun install
   bun run db:migrate
   bun run db:seed
   bun run dev
   ```
   *Backend runs at `http://localhost:3001`*

2. **Frontend**:
   ```bash
   cd frontend
   bun install
   npm run dev
   ```
   *Frontend dev server runs at `http://localhost:5173`*

### Running via Docker (Production Container)
```bash
docker compose up -d --build
```
Access the application at **`http://localhost:8765`**.

---

## 🚀 Future & Unimplemented Features

While Phase 1 (Foundation) and Phase 2 (Dockerization) have been completed, several features are planned for future iterations to enhance the user experience and functionality of the application:

### 1. AI-Powered Autofill & Metadata Fetching
- **Concept**: The user requested an "autofill and AI" feature. This involves automatically fetching item metadata (cover images, synopsis, release dates, authors, etc.) based solely on the entered item title.
- **Implementation Idea**: Integrate with external APIs (TMDB for movies, AniList for anime, Google Books, etc.) or use a small language model to structure search results to instantly populate item details and custom fields without manual data entry.

### 2. Custom UI Confirmation Modals
- **Concept**: Replace the default browser `confirm()` dialogs (currently used when deleting a list) with a fully styled, custom modal component.
- **Implementation Idea**: Build a reusable `<ConfirmModal>` component in Svelte that matches the application's Notion/Linear dark aesthetic to improve the overall UI cohesiveness.

### 3. Advanced Filtering & Views
- **Concept**: Allow users to filter lists by custom fields, tags, and status, and save these views.
- **Implementation Idea**: Add a filter bar above the ListTable and persist filter parameters in the URL or local storage. Also, introduce a Kanban board view grouping items by their status.

### 4. Drag & Drop Reordering
- **Concept**: Enable intuitive reordering of lists in the sidebar and items within lists.
- **Implementation Idea**: Integrate a Svelte drag-and-drop library (e.g., `svelte-dnd-action`) to update the `sort_order` field in the database seamlessly.

### 5. Enhanced Custom Field Types
- **Concept**: Expand beyond basic text/number fields.
- **Implementation Idea**: Introduce rich text notes, multi-select dropdowns, date ranges, checkboxes, and relation fields (linking items across different lists).

### 6. Card / Grid View Toggle
- **Concept**: Allow users to switch between the default Table View and a more visual Card/Grid View for their lists.
- **Implementation Idea**: Build a `<ListGrid>` component that displays items as visual cards (highlighting the cover image, title, and key stats) and add a toggle button in the list header to switch layouts dynamically.

### 7. Spotify / Music Provider Integration
- **Concept**: A special list template for music/playlists that connects to the Spotify API (or other providers).
- **Implementation Idea**: Authenticate with a music provider API to fetch song metadata. Include an embedded, ad-free audio player (or Web Playback SDK) directly within the app so the user can save, organize, and listen to their playlists natively in List-en-do.
