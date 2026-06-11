import type { DocumentStatus } from "../types";
import { ALL_STATUSES, STATUS_LABELS } from "../types";

interface Props {
  selected: DocumentStatus | undefined;
  onChange: (status: DocumentStatus | undefined) => void;
}

export function StatusFilter({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <FilterButton
        label="All"
        active={selected === undefined}
        onClick={() => onChange(undefined)}
      />
      {ALL_STATUSES.map((status) => (
        <FilterButton
          key={status}
          label={STATUS_LABELS[status]}
          active={selected === status}
          onClick={() => onChange(status)}
        />
      ))}
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
      className={`cursor-pointer rounded-md border px-4 py-1.5 text-sm transition-colors ${
        active
          ? "border-blue-500 bg-blue-500 font-semibold text-white"
          : "border-gray-300 bg-white font-normal text-gray-700 hover:border-gray-400"
      }`}
    >
      {label}
    </button>
  );
}
