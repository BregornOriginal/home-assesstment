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

type FieldErrors = Partial<Record<keyof CreateDocumentPayload, string>>;

function validate(form: CreateDocumentPayload): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.title.trim()) errors.title = "Title is required.";
  else if (form.title.trim().length < 2) errors.title = "Title must be at least 2 characters.";

  if (!form.submitter_name.trim()) errors.submitter_name = "Submitter name is required.";

  if (!form.category.trim()) errors.category = "Category is required.";

  if (!form.summary.trim()) errors.summary = "Summary is required.";
  else if (form.summary.trim().length < 10)
    errors.summary = "Summary must be at least 10 characters.";

  return errors;
}

export function CreateDocumentModal({ onSubmit, onClose }: Props) {
  const { toast } = useToast();
  const [form, setForm] = useState<CreateDocumentPayload>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CreateDocumentPayload, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleClose = useCallback(() => onClose(), [onClose]);
  useEscapeKey(handleClose);

  function set<K extends keyof CreateDocumentPayload>(
    key: K,
    value: CreateDocumentPayload[K],
  ) {
    const next = { ...form, [key]: value };
    setForm(next);
    if (touched[key]) {
      const errors = validate(next);
      setFieldErrors((prev) => ({ ...prev, [key]: errors[key] }));
    }
  }

  function handleBlur(key: keyof CreateDocumentPayload) {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const errors = validate(form);
    setFieldErrors((prev) => ({ ...prev, [key]: errors[key] }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      Object.keys(EMPTY).map((k) => [k, true]),
    ) as Record<keyof CreateDocumentPayload, boolean>;
    setTouched(allTouched);

    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(form);
      toast(`"${form.title}" created successfully.`);
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to create document.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/35 sm:items-center sm:justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex h-full w-full flex-col bg-white p-5 sm:h-auto sm:max-w-lg sm:rounded-xl sm:p-7 sm:shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">New Document</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded p-1 text-xl leading-none text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <FormField label="Title" error={fieldErrors.title} required>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              maxLength={200}
              className={inputClass(!!fieldErrors.title)}
              placeholder="e.g. Q3 Budget Proposal"
            />
          </FormField>

          <FormField label="Submitter Name" error={fieldErrors.submitter_name} required>
            <input
              value={form.submitter_name}
              onChange={(e) => set("submitter_name", e.target.value)}
              onBlur={() => handleBlur("submitter_name")}
              maxLength={100}
              className={inputClass(!!fieldErrors.submitter_name)}
              placeholder="e.g. Alex Morgan"
            />
          </FormField>

          <FormField label="Category" error={fieldErrors.category} required>
            <input
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              onBlur={() => handleBlur("category")}
              maxLength={100}
              className={inputClass(!!fieldErrors.category)}
              placeholder="e.g. Legal, Marketing, Engineering"
            />
          </FormField>

          <FormField label="Priority" required>
            <select
              value={form.priority}
              onChange={(e) => set("priority", e.target.value as DocumentPriority)}
              className={inputClass(false)}
            >
              {ALL_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_LABELS[p]}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Summary" error={fieldErrors.summary} required>
            <textarea
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
              onBlur={() => handleBlur("summary")}
              maxLength={1000}
              rows={3}
              className={`${inputClass(!!fieldErrors.summary)} resize-y`}
              placeholder="Brief description of the document content..."
            />
            <p className="mt-1 text-right text-xs text-gray-400">
              {form.summary.length}/1000
            </p>
          </FormField>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

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
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
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
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-md border px-2.5 py-1.5 text-sm bg-white focus:outline-none ${
    hasError
      ? "border-red-400 focus:border-red-500"
      : "border-gray-300 focus:border-blue-400"
  }`;
}
