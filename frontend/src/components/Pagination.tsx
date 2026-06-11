interface Props {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between pt-2 text-sm text-gray-500">
      <span>
        {start}–{end} of {total}
      </span>

      <div className="flex items-center gap-1">
        <PageButton
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          label="«"
          title="First page"
        />
        <PageButton
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          label="‹"
          title="Previous page"
        />

        {getPageNumbers(page, totalPages).map((p, i) =>
          p === null ? (
            <span key={`ellipsis-${i}`} className="px-1 text-gray-400">
              …
            </span>
          ) : (
            <PageButton
              key={p}
              onClick={() => onPageChange(p)}
              disabled={p === page}
              active={p === page}
              label={String(p)}
            />
          ),
        )}

        <PageButton
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          label="›"
          title="Next page"
        />
        <PageButton
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          label="»"
          title="Last page"
        />
      </div>
    </div>
  );
}

interface PageButtonProps {
  onClick: () => void;
  disabled: boolean;
  active?: boolean;
  label: string;
  title?: string;
}

function PageButton({ onClick, disabled, active, label, title }: PageButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`min-w-[28px] rounded px-2 py-1 text-xs transition-colors ${
        active
          ? "bg-blue-500 font-semibold text-white"
          : disabled
            ? "cursor-not-allowed text-gray-300"
            : "cursor-pointer text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}

function getPageNumbers(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | null)[] = [1];

  if (current > 3) pages.push(null);

  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }

  if (current < total - 2) pages.push(null);
  pages.push(total);

  return pages;
}
