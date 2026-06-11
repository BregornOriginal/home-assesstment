import json
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import Document
from routes import documents, router

DATA_FILE = Path(__file__).parent / "data" / "documents.json"


@asynccontextmanager
async def lifespan(app: FastAPI):
    raw = json.loads(DATA_FILE.read_text())
    documents.extend(Document(**item) for item in raw)
    yield


app = FastAPI(
    title="Document Review Queue",
    description="API for managing internal documents submitted for review.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
