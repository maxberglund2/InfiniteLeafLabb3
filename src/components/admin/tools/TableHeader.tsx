import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export type SortDirection = "asc" | "desc" | null;

interface TableHeaderProps {
  label: string;
  sortKey?: string;
  currentSort?: { key: string; direction: SortDirection };
  onSort?: (key: string) => void;
  align?: "left" | "center" | "right";
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  label,
  sortKey,
  currentSort,
  onSort,
  align = "left",
}) => {
  const isSortable = sortKey && onSort;
  const isActive = currentSort?.key === sortKey;
  const direction = isActive ? currentSort?.direction : null;

  const handleClick = () => {
    if (isSortable) {
      onSort(sortKey);
    }
  };

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  return (
    <th
      className={`px-4 py-3 ${alignClass} ${isSortable ? "cursor-pointer select-none" : ""}`}
      onClick={handleClick}
    >
      <div
        className={`inline-flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider
                    ${isSortable ? "hover:text-emerald transition-colors" : ""}`}
      >
        {label}
        {isSortable && (
          <span className="text-gray-500">
            {direction === "asc" ? (
              <ArrowUp size={14} className="text-emerald" />
            ) : direction === "desc" ? (
              <ArrowDown size={14} className="text-emerald" />
            ) : (
              <ArrowUpDown size={14} />
            )}
          </span>
        )}
      </div>
    </th>
  );
};
