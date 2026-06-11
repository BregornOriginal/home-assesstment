import type { SortField, SortOrder } from "../types";
import { SORT_FIELD_LABELS } from "../types";

interface Props {
  sortBy: SortField;
  order: SortOrder;
  onSortByChange: (field: SortField) => void;
  onOrderChange: (order: SortOrder) => void;
}

const SORT_FIELDS: SortField[] = ["created_at", "title", "priority"];

export function SortControls({
  sortBy,
  order,
  onSortByChange,
  onOrderChange,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Sort by</span>
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value as SortField)}
        className="cursor-pointer rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs focus:border-blue-400 focus:outline-none"
      >
        {SORT_FIELDS.map((f) => (
          <option key={f} value={f}>
            {SORT_FIELD_LABELS[f]}
          </option>
        ))}
      </select>
      <button
        onClick={() => onOrderChange(order === "asc" ? "desc" : "asc")}
        title={order === "asc" ? "Ascending — click to sort descending" : "Descending — click to sort ascending"}
        className="cursor-pointer rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs hover:bg-gray-50"
      >
        {order === "asc" ? "↑ Asc" : "↓ Desc"}
      </button>
    </div>
  );
}
