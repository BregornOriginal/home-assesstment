import { type ChangeEvent, type ReactNode, useCallback, useState } from "react";

import type { Document, DocumentStatus } from "../types";
import { ALL_STATUSES, PRIORITY_LABELS, STATUS_LABELS } from "../types";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { useToast } from "./Toast";
import { ConfirmDialog } from "./ConfirmDialog";
import { StatusBadge } from "./StatusBadge";

interface Props {
  document: Document;
  onUpdateStatus: (id: string, status: DocumentStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

export function DocumentDetail({
  document,
  onUpdateStatus,
  onDelete,
  onClose,
}: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClose = useCallback(() => onClose(), [onClose]);
  useEscapeKey(handleClose, !showConfirm);

  async function handleStatusChange(e: ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as DocumentStatus;
    setSaving(true);
    try {
      await onUpdateStatus(document.id, next);
      toast(`Status updated to "${STATUS_LABELS[next]}"`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update status.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    setShowConfirm(false);
    setDeleting(true);
    try {
      await onDelete(document.id);
      toast(`"${document.title}" deleted.`);
      onClose();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to delete document.", "error");
      setDeleting(false);
    }
  }

  const createdAt = new Date(document.created_at).toLocaleString();

  return (
    <>
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <h2 className="flex-1 text-base font-semibold text-gray-900">
            {document.title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="ml-2 cursor-pointer rounded p-1 text-xl leading-none text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={document.status} />
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
            {PRIORITY_LABELS[document.priority]} priority
          </span>
          <span className="text-xs text-gray-500">{document.category}</span>
        </div>

        <Field label="Summary">{document.summary}</Field>
        <Field label="Submitted by">{document.submitter_name}</Field>
        <Field label="Created">{createdAt}</Field>
        <Field label="ID">
          <code className="text-xs text-gray-400">{document.id}</code>
        </Field>

        <div>
          <label
            htmlFor="status-select"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400"
          >
            Update status
          </label>
          <div className="flex items-center gap-3">
            <select
              id="status-select"
              value={document.status}
              onChange={handleStatusChange}
              disabled={saving}
              className="cursor-pointer rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm"
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            {saving && (
              <span className="text-xs text-gray-400">Saving...</span>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3">
          <button
            onClick={() => setShowConfirm(true)}
            disabled={deleting}
            className="cursor-pointer rounded-md border border-red-200 bg-white px-4 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete document"}
          </button>
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          title="Delete document"
          description={`"${document.title}" will be permanently removed. This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="text-sm text-gray-700">{children}</p>
    </div>
  );
}
