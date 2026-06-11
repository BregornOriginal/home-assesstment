import type { DocumentPriority, DocumentStatus } from "../types";
import { ALL_PRIORITIES, ALL_STATUSES, PRIORITY_LABELS, STATUS_LABELS } from "../types";

interface Props {
  selectedStatus: DocumentStatus | undefined;
  selectedPriority: DocumentPriority | undefined;
  onStatusChange: (status: DocumentStatus | undefined) => void;
  onPriorityChange: (priority: DocumentPriority | undefined) => void;
}

export function StatusFilter({
  selectedStatus,
  selectedPriority,
  onStatusChange,
  onPriorityChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <div className="flex flex-wrap gap-2">
        <FilterButton
          label="All"
          active={selectedStatus === undefined}
          onClick={() => onStatusChange(undefined)}
        />
        {ALL_STATUSES.map((status) => (
          <FilterButton
            key={status}
            label={STATUS_LABELS[status]}
            active={selectedStatus === status}
            onClick={() => onStatusChange(status)}
          />
        ))}
      </div>

      <div className="h-4 w-px bg-gray-200" />

      <div className="flex flex-wrap gap-2">
        <FilterButton
          label="Any priority"
          active={selectedPriority === undefined}
          onClick={() => onPriorityChange(undefined)}
        />
        {ALL_PRIORITIES.map((priority) => (
          <FilterButton
            key={priority}
            label={PRIORITY_LABELS[priority]}
            active={selectedPriority === priority}
            onClick={() => onPriorityChange(priority)}
          />
        ))}
      </div>
    </div>
  );
}

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded-md border px-3 py-1.5 text-xs transition-colors ${
        active
          ? "border-blue-500 bg-blue-500 font-semibold text-white"
          : "border-gray-300 bg-white font-normal text-gray-700 hover:border-gray-400"
      }`}
    >
      {label}
    </button>
  );
}
