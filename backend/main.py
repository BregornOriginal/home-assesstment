import json
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

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


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    _request: Request, exc: RequestValidationError
) -> JSONResponse:
    errors: dict[str, str] = {}
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"] if loc != "body")
        errors[field] = _friendly_message(error)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Validation failed.", "errors": errors},
    )


def _friendly_message(error: dict) -> str:
    error_type = error.get("type", "")
    field = str(error["loc"][-1]) if error["loc"] else "field"
    ctx = error.get("ctx", {})

    if error_type == "missing":
        return f"{field.replace('_', ' ').capitalize()} is required."
    if error_type == "string_too_short":
        return f"Must be at least {ctx.get('min_length', 1)} character(s)."
    if error_type == "string_too_long":
        return f"Must be at most {ctx.get('max_length', '?')} characters."
    if error_type == "literal_error":
        return f"Invalid value. Allowed: {', '.join(str(v) for v in ctx.get('expected', []))}."
    return error.get("msg", "Invalid value.")


app.include_router(router)
