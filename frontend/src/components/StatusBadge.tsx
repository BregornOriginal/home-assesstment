import type { DocumentStatus } from "../types";
import { STATUS_LABELS } from "../types";

interface Props {
  status: DocumentStatus;
}

const STATUS_CLASSES: Record<DocumentStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  in_review: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${STATUS_CLASSES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
