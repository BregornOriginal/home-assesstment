from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

DocumentStatus = Literal["pending", "in_review", "approved", "rejected"]
DocumentPriority = Literal["low", "medium", "high"]


class Document(BaseModel):
    id: str
    title: str
    submitter_name: str
    category: str
    status: DocumentStatus
    priority: DocumentPriority
    created_at: datetime
    summary: str


class CreateDocumentRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    submitter_name: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=1, max_length=100)
    priority: DocumentPriority
    summary: str = Field(..., min_length=1, max_length=1000)


class UpdateDocumentRequest(BaseModel):
    status: DocumentStatus


class PaginatedResponse(BaseModel):
    items: list[Document]
    total: int
    page: int
    page_size: int
    total_pages: int
