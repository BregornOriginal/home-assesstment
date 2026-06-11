from datetime import UTC, datetime
from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Query

from models import CreateDocumentRequest, Document, DocumentStatus, UpdateDocumentRequest

router = APIRouter(prefix="/documents", tags=["documents"])

# In-memory store — populated from documents.json on startup via main.py
documents: list[Document] = []


def _find(document_id: str) -> Document:
    for doc in documents:
        if doc.id == document_id:
            return doc
    raise HTTPException(status_code=404, detail=f"Document '{document_id}' not found.")


@router.get("", response_model=list[Document])
def list_documents(
    status: Optional[DocumentStatus] = Query(default=None, description="Filter by status"),
) -> list[Document]:
    if status is None:
        return documents
    return [doc for doc in documents if doc.status == status]


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
