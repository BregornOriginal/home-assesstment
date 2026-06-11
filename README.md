# Document Review Queue

An internal document management application that allows users to view, filter, create, update, and delete documents submitted for review.

## Stack

- **Frontend:** React + TypeScript (Vite)
- **Backend:** Python + FastAPI
- **Containerization:** Docker + Docker Compose

## Features

- List all documents with status filtering (Pending, In Review, Approved, Rejected)
- View document details
- Create new documents
- Update document status
- Delete documents
- OpenAPI documentation via FastAPI

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

## Project Structure

```
home-assesstment/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py
│   ├── models.py
│   ├── routes.py
│   └── data/
│       └── documents.json
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── types.ts
        ├── api.ts
        ├── components/
        └── hooks/
```

## Data

The application uses mock data stored in `backend/data/documents.json`. Data is loaded into memory on startup — no database required.

### Document Fields

| Field           | Type                                          |
|-----------------|-----------------------------------------------|
| id              | string                                        |
| title           | string                                        |
| submitter_name  | string                                        |
| category        | string                                        |
| status          | `pending` \| `in_review` \| `approved` \| `rejected` |
| priority        | `low` \| `medium` \| `high`                  |
| created_at      | ISO 8601 datetime                             |
| summary         | string                                        |

## API Endpoints

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | `/documents`                | List all documents       |
| GET    | `/documents/{document_id}`  | Get a single document    |
| POST   | `/documents`                | Create a new document    |
| PATCH  | `/documents/{document_id}`  | Update document status   |
| DELETE | `/documents/{document_id}`  | Delete a document        |
