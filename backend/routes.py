from datetime import UTC, datetime
from typing import Literal, Optional
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Query

from models import (
    CreateDocumentRequest,
    Document,
    DocumentPriority,
    DocumentStatus,
    PaginatedResponse,
    UpdateDocumentRequest,
)

router = APIRouter(prefix="/documents", tags=["documents"])

# In-memory store — populated from documents.json on startup via main.py
documents: list[Document] = []

SortField = Literal["created_at", "title", "priority"]
SortOrder = Literal["asc", "desc"]

PRIORITY_RANK = {"low": 0, "medium": 1, "high": 2}


def _find(document_id: str) -> Document:
    for doc in documents:
        if doc.id == document_id:
            return doc
    raise HTTPException(status_code=404, detail=f"Document '{document_id}' not found.")


@router.get("", response_model=PaginatedResponse)
def list_documents(
    status: Optional[DocumentStatus] = Query(default=None, description="Filter by status"),
    priority: Optional[DocumentPriority] = Query(default=None, description="Filter by priority"),
    search: Optional[str] = Query(default=None, description="Search title, submitter or category"),
    sort_by: SortField = Query(default="created_at", description="Field to sort by"),
    order: SortOrder = Query(default="desc", description="Sort direction"),
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(default=5, ge=1, le=50, description="Items per page"),
) -> PaginatedResponse:
    result = list(documents)

    if status is not None:
        result = [d for d in result if d.status == status]

    if priority is not None:
        result = [d for d in result if d.priority == priority]

    if search:
        term = search.lower()
        result = [
            d
            for d in result
            if term in d.title.lower()
            or term in d.submitter_name.lower()
            or term in d.category.lower()
        ]

    reverse = order == "desc"
    if sort_by == "title":
        result.sort(key=lambda d: d.title.lower(), reverse=reverse)
    elif sort_by == "priority":
        result.sort(key=lambda d: PRIORITY_RANK[d.priority], reverse=reverse)
    else:
        result.sort(key=lambda d: d.created_at, reverse=reverse)

    total = len(result)
    total_pages = max(1, -(-total // page_size))  # ceiling division
    start = (page - 1) * page_size
    items = result[start : start + page_size]

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/{document_id}", response_model=Document)
def get_document(document_id: str) -> Document:
    return _find(document_id)


@router.post("", response_model=Document, status_code=201)
def create_document(payload: CreateDocumentRequest) -> Document:
    new_doc = Document(
        id=f"doc_{uuid4().hex[:8]}",
        title=payload.title,
        submitter_name=payload.submitter_name,
        category=payload.category,
        status="pending",
        priority=payload.priority,
        created_at=datetime.now(UTC),
        summary=payload.summary,
    )
    documents.append(new_doc)
    return new_doc


@router.patch("/{document_id}", response_model=Document)
def update_document_status(document_id: str, payload: UpdateDocumentRequest) -> Document:
    doc = _find(document_id)
    updated = doc.model_copy(update={"status": payload.status})
    idx = next(i for i, d in enumerate(documents) if d.id == document_id)
    documents[idx] = updated
    return updated


@router.delete("/{document_id}", status_code=204)
def delete_document(document_id: str) -> None:
    doc = _find(document_id)
    documents.remove(doc)
