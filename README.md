# Document Review Queue

An internal document management application that allows users to view, filter, create, update, and delete documents submitted for review.

## Video presentation

https://www.loom.com/share/e43120b2576b442f88df540e446d9efc

## Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4 + TanStack Query v5
- **Backend:** Python 3.12 + FastAPI + Pydantic v2
- **Containerization:** Docker + Docker Compose

## Features

- List all documents with status and priority filtering
- Search by title, submitter name or category (debounced)
- Sort by date, title or priority
- Server-side pagination
- View document details in a side panel (desktop) or bottom sheet (mobile)
- Create new documents with inline field validation
- Update document status
- Delete documents with a confirmation dialog
- Toast notifications for all data mutations
- Responsive layout — mobile-first, adapts from single column to two-column grid
- OpenAPI documentation via FastAPI (`/docs`)

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Run the Application

```bash
docker compose up --build
```

| Service       | URL                        |
|---------------|----------------------------|
| Frontend      | http://localhost:5173       |
| Backend API   | http://localhost:8000       |
| API Docs      | http://localhost:8000/docs  |

### Local Development (without Docker)

**Backend**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

> Note: for local development, update the Vite proxy target in `frontend/vite.config.ts` from `http://backend:8000` to `http://localhost:8000`.

### Linting

**Backend**
```bash
cd backend
ruff check .
ruff format --check .
```

**Frontend**
```bash
cd frontend
npm run lint
npm run format:check
```

## Project Structure

```
home-assesstment/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── ruff.toml
│   ├── main.py           # App factory, CORS, validation error handler
│   ├── models.py         # Pydantic models
│   ├── routes.py         # All endpoint handlers
│   └── data/
│       └── documents.json
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.ts
    ├── eslint.config.js
    ├── .prettierrc
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── types.ts
        ├── api.ts
        ├── components/
        │   ├── CreateDocumentModal.tsx
        │   ├── ConfirmDialog.tsx
        │   ├── DocumentCard.tsx
        │   ├── DocumentDetail.tsx
        │   ├── DocumentList.tsx
        │   ├── Pagination.tsx
        │   ├── SearchBar.tsx
        │   ├── SortControls.tsx
        │   ├── StatusBadge.tsx
        │   ├── StatusFilter.tsx
        │   └── Toast.tsx
        └── hooks/
            ├── useDocuments.ts
            └── useEscapeKey.ts
```

## Data

Mock data is stored in `backend/data/documents.json` and loaded into memory on startup — no database required. The application ships with 18 seed documents across categories including Legal, Engineering, Marketing, Security, Product, Finance, HR and Operations.

### Document Fields

| Field           | Type                                                        |
|-----------------|-------------------------------------------------------------|
| id              | string                                                      |
| title           | string                                                      |
| submitter_name  | string                                                      |
| category        | string                                                      |
| status          | `pending` \| `in_review` \| `approved` \| `rejected`       |
| priority        | `low` \| `medium` \| `high`                                |
| created_at      | ISO 8601 datetime                                           |
| summary         | string                                                      |

## API Endpoints

| Method | Endpoint                    | Description                          |
|--------|-----------------------------|--------------------------------------|
| GET    | `/documents`                | List documents (supports all filters)|
| GET    | `/documents/{document_id}`  | Get a single document                |
| POST   | `/documents`                | Create a new document                |
| PATCH  | `/documents/{document_id}`  | Update document status               |
| DELETE | `/documents/{document_id}`  | Delete a document                    |

### Query Parameters for `GET /documents`

| Parameter  | Type    | Default      | Description                              |
|------------|---------|--------------|------------------------------------------|
| `status`   | string  | —            | Filter by status                         |
| `priority` | string  | —            | Filter by priority                       |
| `search`   | string  | —            | Search title, submitter name or category |
| `sort_by`  | string  | `created_at` | Sort field: `created_at`, `title`, `priority` |
| `order`    | string  | `desc`       | Sort direction: `asc`, `desc`            |
| `page`     | integer | `1`          | Page number                              |
| `page_size`| integer | `5`          | Items per page (max 50)                  |

---

## AI Tool Usage

### Tools Used

- **Cursor** (AI-powered IDE) with the **Claude Sonnet 4.5** model as the primary coding assistant throughout the entire project.

### How They Were Used

| Area | Usage |
|---|---|
| Boilerplate generation | Initial project scaffolding — Dockerfiles, `docker-compose.yml`, `requirements.txt`, `package.json`, `tsconfig.json`, `vite.config.ts`, `.prettierrc`, `eslint.config.js` |
| Backend implementation | FastAPI app structure, Pydantic models, route handlers, pagination logic, validation error handler, query param filtering and sorting |
| React components | All UI components: `DocumentList`, `DocumentCard`, `DocumentDetail`, `CreateDocumentModal`, `StatusFilter`, `SearchBar`, `SortControls`, `Pagination`, `StatusBadge`, `ConfirmDialog`, `Toast` |
| Hooks | `useDocuments` with TanStack Query integration, `useEscapeKey` |
| Docker setup | Multi-service `docker-compose.yml`, `.dockerignore` files, `npm ci` vs `npm install` distinction |
| Tooling | `ruff.toml` configuration, ESLint flat config, Tailwind v4 Vite plugin setup |
| Documentation | Initial README structure and this AI Usage section |

### Accepted Suggestions

- Full backend route implementation including the pagination ceiling division formula (`-(-total // page_size)`) and the in-memory sort/filter pipeline.
- TanStack Query integration pattern: `useQuery` + `useMutation` + `invalidateQueries` with `keepPreviousData` for smooth pagination transitions.
- The `SearchBar` debounce implementation using a `useRef` to hold the `onChange` callback — this correctly decouples the debounce timer from function identity changes across renders.
- Tailwind v4 setup via `@tailwindcss/vite` plugin with `@import "tailwindcss"` in CSS (no `tailwind.config.js` required).
- The responsive bottom sheet pattern for `DocumentDetail` on mobile using `fixed inset-x-0 bottom-0` with a `max-h-[70vh]` scroll container.
- Per-field validation in `CreateDocumentModal` using a `touched` state map to show errors only after a field has been interacted with.

### Modified Suggestions

- **`useDocuments` hook interface:** the AI initially returned a flat `selectedStatus` field. Refactored to a `filters: DocumentFilters` object to accommodate the growing set of query params (status, priority, search, sort, pagination) without breaking the hook's public API.
- **`StatusFilter` component:** originally only handled status. Expanded to include priority filtering in the same component with a visual separator rather than a separate component, to keep the filter bar compact.
- **Backend error handler:** the AI generated a generic message string. Modified to return a structured `{ detail, errors }` object so the frontend can surface per-field messages rather than a single concatenated error.
- **`patch()` stability:** the initial hook implementation created a new `patch` function on every render. Added `useCallback` with no dependencies after identifying this as the root cause of a pagination reset bug (page jumping back to 1 on re-render).

### Rejected Suggestions

- **Single-container approach** (FastAPI serving the React build as static files): rejected in favor of two separate containers matching the assessment's `frontend/Dockerfile` + `backend/Dockerfile` structure. The two-container setup is cleaner for development (`--reload` on the backend, Vite HMR on the frontend) and maps better to a real deployment topology.
- **`window.confirm()` for delete confirmation:** the AI initially generated a `window.confirm()` call. Rejected because it is not styleable, does not support keyboard navigation, and behaves inconsistently across browsers. Replaced with a custom `ConfirmDialog` component.
- **`import React from "react"` at the top of every component:** the AI initially included this in several files. Rejected — with `"jsx": "react-jsx"` in the tsconfig the runtime is injected automatically. Specific types (`ChangeEvent`, `ReactNode`, `CSSProperties`) are imported directly instead.
- **Axios as HTTP client:** suggested early on as an alternative to `fetch`. Rejected — the native `fetch` API is sufficient for this scope and avoids an extra dependency.

### Validation Process

- **Linting after every stage:** `ruff check` and `ruff format --check` for Python; ESLint and the TypeScript compiler (`tsc`) via the IDE for the frontend. No stage was committed with lint errors.
- **Docker end-to-end testing:** `docker compose up --build` was run after each PR to verify that both containers started correctly, the Vite proxy reached the FastAPI backend, and all endpoints returned expected responses (verified in the backend logs).
- **Manual browser testing:** each feature (filtering, sorting, pagination, search, CRUD, toasts, keyboard shortcuts, mobile layout) was exercised in the browser with Docker running.
- **Bug verification via backend logs:** when filters appeared not to be working, the backend access logs confirmed that query params were being sent and processed correctly — isolating the issue to a stale Docker image rather than a code bug.
- **Code review of AI output:** every generated file was read before committing. Key review points included: correct Pydantic v2 API usage (`model_copy` instead of deprecated `.copy()`), stable `useCallback`/`useRef` patterns for React hooks, and correct TanStack Query v5 API (`placeholderData: keepPreviousData` instead of the v4 `keepPreviousData` boolean option).
