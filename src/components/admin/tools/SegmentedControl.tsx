import React from "react";

interface SegmentOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <div className="inline-flex bg-moss border border-jade/30 rounded-lg p-1 gap-1">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`
            px-4 py-2 rounded-md font-medium text-sm transition-all duration-200
            flex items-center gap-2 whitespace-nowrap
            ${
              value === option.id
                ? "bg-jade text-white shadow-sm"
                : "text-gray-400 hover:text-white hover:bg-moss/50"
            }
          `}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
};
