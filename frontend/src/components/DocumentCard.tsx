import type { Document } from "../types";
import { PRIORITY_LABELS } from "../types";
import { StatusBadge } from "./StatusBadge";

interface Props {
  document: Document;
  selected: boolean;
  onClick: () => void;
}

const PRIORITY_CLASSES: Record<string, string> = {
  high: "text-red-600",
  medium: "text-amber-600",
  low: "text-gray-500",
};

export function DocumentCard({ document, selected, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg border p-4 transition-colors ${
        selected
          ? "border-blue-400 bg-blue-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex-1 text-sm font-semibold text-gray-900">
          {document.title}
        </span>
        <StatusBadge status={document.status} />
      </div>

      <div className="mt-1.5 flex gap-3 text-xs text-gray-500">
        <span>{document.category}</span>
        <span>·</span>
        <span className={`font-medium ${PRIORITY_CLASSES[document.priority]}`}>
          {PRIORITY_LABELS[document.priority]}
        </span>
        <span>·</span>
        <span>{document.submitter_name}</span>
      </div>
    </div>
  );
}
