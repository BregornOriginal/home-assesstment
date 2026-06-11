import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { api } from "../api";
import type {
  CreateDocumentPayload,
  Document,
  DocumentFilters,
  DocumentPriority,
  DocumentStatus,
  PaginatedResponse,
  SortField,
  SortOrder,
} from "../types";

const DOCUMENTS_KEY = "documents";
const DEFAULT_PAGE_SIZE = 5;

interface UseDocumentsReturn {
  documents: Document[];
  pagination: Omit<PaginatedResponse, "items">;
  loading: boolean;
  error: string | null;
  filters: DocumentFilters;
  setStatus: (status: DocumentStatus | undefined) => void;
  setPriority: (priority: DocumentPriority | undefined) => void;
  setSearch: (search: string) => void;
  setSortBy: (sort_by: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  setPage: (page: number) => void;
  createDocument: (payload: CreateDocumentPayload) => Promise<void>;
  updateStatus: (id: string, status: DocumentStatus) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

const DEFAULT_FILTERS: DocumentFilters = {
  sort_by: "created_at",
  order: "desc",
  page: 1,
  page_size: DEFAULT_PAGE_SIZE,
};

const DEFAULT_PAGINATION: Omit<PaginatedResponse, "items"> = {
  total: 0,
  page: 1,
  page_size: DEFAULT_PAGE_SIZE,
  total_pages: 1,
};

export function useDocuments(): UseDocumentsReturn {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<DocumentFilters>(DEFAULT_FILTERS);

  const { data, isLoading, error } = useQuery({
    queryKey: [DOCUMENTS_KEY, filters],
    queryFn: () => api.getDocuments(filters),
    placeholderData: keepPreviousData,
  });

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: [DOCUMENTS_KEY] });
  }

  const createMutation = useMutation({
    mutationFn: api.createDocument,
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: DocumentStatus }) =>
      api.updateDocumentStatus(id, { status }),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteDocument,
    onSuccess: invalidate,
  });

  // Reset to page 1 whenever filters (other than page) change
  const patch = useCallback((partial: Partial<DocumentFilters>) => {
    const resetsPage = !("page" in partial);
    setFilters((prev) => ({
      ...prev,
      ...partial,
      ...(resetsPage ? { page: 1 } : {}),
    }));
  }, []);

  const { items: documents = [], ...paginationInfo } = data ?? {
    items: [],
    ...DEFAULT_PAGINATION,
  };

  return {
    documents,
    pagination: paginationInfo,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    filters,
    setStatus: (status) => patch({ status }),
    setPriority: (priority) => patch({ priority }),
    setSearch: (search) => patch({ search: search || undefined }),
    setSortBy: (sort_by) => patch({ sort_by }),
    setSortOrder: (order) => patch({ order }),
    setPage: (page) => patch({ page }),
    createDocument: (payload) => createMutation.mutateAsync(payload).then(() => undefined),
    updateStatus: (id, status) => updateMutation.mutateAsync({ id, status }).then(() => undefined),
    deleteDocument: (id) => deleteMutation.mutateAsync(id).then(() => undefined),
  };
}
