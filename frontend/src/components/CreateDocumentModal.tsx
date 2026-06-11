import { type FormEvent, type ReactNode, useCallback, useState } from "react";

import type { CreateDocumentPayload, DocumentPriority } from "../types";
import { ALL_PRIORITIES, PRIORITY_LABELS } from "../types";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { useToast } from "./Toast";

interface Props {
  onSubmit: (payload: CreateDocumentPayload) => Promise<void>;
  onClose: () => void;
}

const EMPTY: CreateDocumentPayload = {
  title: "",
  submitter_name: "",
  category: "",
  priority: "medium",
  summary: "",
};

export function CreateDocumentModal({ onSubmit, onClose }: Props) {
  const { toast } = useToast();
  const [form, setForm] = useState<CreateDocumentPayload>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = useCallback(() => onClose(), [onClose]);
  useEscapeKey(handleClose);

  function set<K extends keyof CreateDocumentPayload>(
    key: K,
    value: CreateDocumentPayload[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(form);
      toast(`"${form.title}" created successfully.`);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create document.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-xl bg-white p-7 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            New Document
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded p-1 text-xl leading-none text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Title" required>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              maxLength={200}
              className={inputClass}
              placeholder="e.g. Q3 Budget Proposal"
            />
          </FormField>

          <FormField label="Submitter Name" required>
            <input
              value={form.submitter_name}
              onChange={(e) => set("submitter_name", e.target.value)}
              required
              maxLength={100}
              className={inputClass}
              placeholder="e.g. Alex Morgan"
            />
          </FormField>

          <FormField label="Category" required>
            <input
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              required
              maxLength={100}
              className={inputClass}
              placeholder="e.g. Legal, Marketing, Engineering"
            />
          </FormField>

          <FormField label="Priority" required>
            <select
              value={form.priority}
              onChange={(e) => set("priority", e.target.value as DocumentPriority)}
              className={inputClass}
            >
              {ALL_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_LABELS[p]}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Summary" required>
            <textarea
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              required
              maxLength={1000}
              rows={3}
              className={`${inputClass} resize-y`}
              placeholder="Brief description of the document content..."
            />
          </FormField>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="mt-1 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer rounded-md border-none bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm focus:border-blue-400 focus:outline-none";
