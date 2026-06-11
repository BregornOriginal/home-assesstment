import type {
  CreateDocumentPayload,
  Document,
  DocumentFilters,
  PaginatedResponse,
  UpdateDocumentPayload,
} from "./types";

const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const { detail, errors } = body as {
      detail?: string;
      errors?: Record<string, string>;
    };
    const message = errors
      ? Object.values(errors).join(" ")
      : (detail ?? `Request failed: ${res.status}`);
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  getDocuments(filters?: DocumentFilters): Promise<PaginatedResponse> {
    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.priority) params.set("priority", filters.priority);
    if (filters?.search) params.set("search", filters.search);
    if (filters?.sort_by) params.set("sort_by", filters.sort_by);
    if (filters?.order) params.set("order", filters.order);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.page_size) params.set("page_size", String(filters.page_size));
    const query = params.size ? `?${params.toString()}` : "";
    return request<PaginatedResponse>(`/documents${query}`);
  },

  getDocument(id: string): Promise<Document> {
    return request<Document>(`/documents/${id}`);
  },

  createDocument(payload: CreateDocumentPayload): Promise<Document> {
    return request<Document>("/documents", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateDocumentStatus(id: string, payload: UpdateDocumentPayload): Promise<Document> {
    return request<Document>(`/documents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  deleteDocument(id: string): Promise<void> {
    return request<void>(`/documents/${id}`, { method: "DELETE" });
  },
};
