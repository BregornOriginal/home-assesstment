import type { Document } from "../types";
import { DocumentCard } from "./DocumentCard";

interface Props {
  documents: Document[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  onSelect: (doc: Document) => void;
}

export function DocumentList({
  documents,
  loading,
  error,
  selectedId,
  onSelect,
}: Props) {
  if (loading) {
    return <p className="py-4 text-sm text-gray-500">Loading documents...</p>;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <p className="py-4 text-sm text-gray-400">No documents found.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          selected={doc.id === selectedId}
          onClick={() => onSelect(doc)}
        />
      ))}
    </div>
  );
}
