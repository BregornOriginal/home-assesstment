import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { api } from "../api";
import type { CreateDocumentPayload, Document, DocumentStatus } from "../types";

const DOCUMENTS_KEY = "documents";

interface UseDocumentsReturn {
  documents: Document[];
  loading: boolean;
  error: string | null;
  selectedStatus: DocumentStatus | undefined;
  setSelectedStatus: (status: DocumentStatus | undefined) => void;
  createDocument: (payload: CreateDocumentPayload) => Promise<void>;
  updateStatus: (id: string, status: DocumentStatus) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

export function useDocuments(): UseDocumentsReturn {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<
    DocumentStatus | undefined
  >(undefined);

  const { data: documents = [], isLoading, error } = useQuery({
    queryKey: [DOCUMENTS_KEY, selectedStatus],
    queryFn: () => api.getDocuments(selectedStatus),
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

  return {
    documents,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    selectedStatus,
    setSelectedStatus,
    createDocument: (payload) => createMutation.mutateAsync(payload).then(() => undefined),
    updateStatus: (id, status) => updateMutation.mutateAsync({ id, status }).then(() => undefined),
    deleteDocument: (id) => deleteMutation.mutateAsync(id).then(() => undefined),
  };
}
