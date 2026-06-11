import { useEffect, useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export function SearchBar({ value, onChange, debounceMs = 300 }: Props) {
  const [local, setLocal] = useState(value);
  const onChangeRef = useRef(onChange);

  // Keep the ref current without making it a debounce dependency
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    const timer = setTimeout(() => onChangeRef.current(local), debounceMs);
    return () => clearTimeout(timer);
  }, [local, debounceMs]); // onChange intentionally excluded via ref

  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
      </span>
      <input
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Search by title, submitter or category..."
        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none"
      />
    </div>
  );
}
