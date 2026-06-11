import { useState } from "react";

import { CreateDocumentModal } from "./components/CreateDocumentModal";
import { DocumentDetail } from "./components/DocumentDetail";
import { DocumentList } from "./components/DocumentList";
import { Pagination } from "./components/Pagination";
import { SearchBar } from "./components/SearchBar";
import { SortControls } from "./components/SortControls";
import { StatusFilter } from "./components/StatusFilter";
import { useDocuments } from "./hooks/useDocuments";
import type { Document } from "./types";

export function App() {
  const {
    documents,
    pagination,
    loading,
    error,
    filters,
    setStatus,
    setPriority,
    setSearch,
    setSortBy,
    setSortOrder,
    setPage,
    createDocument,
    updateStatus,
    deleteDocument,
  } = useDocuments();

  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  async function handleUpdateStatus(id: string, status: Document["status"]) {
    await updateStatus(id, status);
    setSelectedDoc((prev) => (prev?.id === id ? { ...prev, status } : prev));
  }

  async function handleDelete(id: string) {
    await deleteDocument(id);
    setSelectedDoc(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
        <div>
          <h1 className="text-base font-bold text-gray-900">
            Document Review Queue
          </h1>
          <p className="mt-0.5 text-xs text-gray-400">
            {pagination.total} document{pagination.total !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="cursor-pointer rounded-md border-none bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
        >
          + New Document
        </button>
      </header>

      <main
        className={`mx-auto max-w-6xl items-start gap-6 p-8 ${
          selectedDoc ? "grid grid-cols-[1fr_380px]" : "block"
        }`}
      >
        <div className="flex flex-col gap-4">
          <SearchBar
            value={filters.search ?? ""}
            onChange={setSearch}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <StatusFilter
              selectedStatus={filters.status}
              selectedPriority={filters.priority}
              onStatusChange={setStatus}
              onPriorityChange={setPriority}
            />
            <SortControls
              sortBy={filters.sort_by ?? "created_at"}
              order={filters.order ?? "desc"}
              onSortByChange={setSortBy}
              onOrderChange={setSortOrder}
            />
          </div>

          <DocumentList
            documents={documents}
            loading={loading}
            error={error}
            selectedId={selectedDoc?.id ?? null}
            onSelect={setSelectedDoc}
          />

          <Pagination
            page={pagination.page}
            totalPages={pagination.total_pages}
            total={pagination.total}
            pageSize={pagination.page_size}
            onPageChange={setPage}
          />
        </div>

        {selectedDoc && (
          <div className="sticky top-8">
            <DocumentDetail
              document={selectedDoc}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
              onClose={() => setSelectedDoc(null)}
            />
          </div>
        )}
      </main>

      {showCreate && (
        <CreateDocumentModal
          onSubmit={createDocument}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}
