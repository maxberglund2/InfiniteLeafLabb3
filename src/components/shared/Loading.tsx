import React from "react";

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-jade border-t-emerald rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🍃</span>
        </div>
      </div>
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  );
};
