import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  const variantStyles = {
    primary:
      "bg-linear-to-r from-jade to-emerald hover:from-emerald hover:to-jade text-white shadow-lg hover:scale-105",
    secondary: "border-2 border-jade text-white hover:bg-jade hover:scale-105",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:scale-105",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
