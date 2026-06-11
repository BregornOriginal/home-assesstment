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
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-4 py-3 sm:px-8 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-sm font-bold text-gray-900 sm:text-base">
              Document Review Queue
            </h1>
            <p className="mt-0.5 text-xs text-gray-400">
              {pagination.total} document{pagination.total !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="cursor-pointer whitespace-nowrap rounded-md border-none bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 sm:px-4 sm:py-2 sm:text-sm"
          >
            + New
          </button>
        </div>
      </header>

      {/* Main layout: single column on mobile, two-column on lg when detail is open */}
      <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <div
          className={`items-start gap-6 ${
            selectedDoc ? "lg:grid lg:grid-cols-[1fr_380px]" : "block"
          }`}
        >
          {/* Left: list + controls */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <SearchBar value={filters.search ?? ""} onChange={setSearch} />

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
              <div className="overflow-x-auto pb-1">
                <StatusFilter
                  selectedStatus={filters.status}
                  selectedPriority={filters.priority}
                  onStatusChange={setStatus}
                  onPriorityChange={setPriority}
                />
              </div>
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
              onSelect={(doc) => setSelectedDoc(doc)}
            />

            <Pagination
              page={pagination.page}
              totalPages={pagination.total_pages}
              total={pagination.total}
              pageSize={pagination.page_size}
              onPageChange={setPage}
            />
          </div>

          {/* Right: detail panel — bottom sheet on mobile, sticky sidebar on lg */}
          {selectedDoc && (
            <>
              {/* Mobile: fixed bottom sheet */}
              <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
                <div className="max-h-[70vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl">
                  <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-gray-300" />
                  <div className="p-4">
                    <DocumentDetail
                      document={selectedDoc}
                      onUpdateStatus={handleUpdateStatus}
                      onDelete={handleDelete}
                      onClose={() => setSelectedDoc(null)}
                    />
                  </div>
                </div>
              </div>
              {/* Backdrop on mobile */}
              <div
                className="fixed inset-0 z-30 bg-black/20 lg:hidden"
                onClick={() => setSelectedDoc(null)}
              />
              {/* Desktop: sticky sidebar */}
              <div className="sticky top-8 hidden lg:block">
                <DocumentDetail
                  document={selectedDoc}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDelete}
                  onClose={() => setSelectedDoc(null)}
                />
              </div>
            </>
          )}
        </div>
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
