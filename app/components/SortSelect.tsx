"use client";

interface SortOption {
  label: string;
  value: string;
}

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const sortOptions: SortOption[] = [
  { label: "ID（昇順）", value: "id_asc" },
  { label: "ID（降順）", value: "id_desc" },
  { label: "名前（昇順）", value: "name_asc" },
  { label: "名前（降順）", value: "name_desc" },
  { label: "作成日時（新しい順）", value: "created_desc" },
  { label: "作成日時（古い順）", value: "created_asc" },
  { label: "更新日時（新しい順）", value: "updated_desc" },
  { label: "更新日時（古い順）", value: "updated_asc" },
];

export default function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
