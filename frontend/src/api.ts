import type {
  CreateDocumentPayload,
  Document,
  DocumentStatus,
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
    const message =
      (body as { detail?: string }).detail ?? `Request failed: ${res.status}`;
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  getDocuments(status?: DocumentStatus): Promise<Document[]> {
    const query = status ? `?status=${status}` : "";
    return request<Document[]>(`/documents${query}`);
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
