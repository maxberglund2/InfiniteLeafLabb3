"use client";

import React from "react";

interface Step {
  number: number;
  title: string;
}

interface ProgressStepsProps {
  currentStep: number;
  steps: Step[];
  onStepClick: (stepNumber: number) => void;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  currentStep,
  steps,
  onStepClick,
}) => {
  return (
    <div className="w-full py-6 md:py-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto px-2">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isAccessible = step.number <= currentStep;

          return (
            <React.Fragment key={step.number}>
              {/* Step Circle & Label Container */}
              <div
                className={`flex flex-col items-center z-10 transition-all ${
                  isAccessible
                    ? "cursor-pointer hover:opacity-80"
                    : "cursor-not-allowed opacity-50"
                }`}
                onClick={() => isAccessible && onStepClick(step.number)}
              >
                {/* Circle: Scaled down on mobile (w-8 h-8) vs desktop (w-12 h-12) */}
                <div
                  className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-lg transition-all duration-300 ${
                    isCompleted
                      ? "bg-emerald text-white scale-110"
                      : isCurrent
                        ? "bg-jade text-white shadow-lg shadow-jade/50"
                        : "bg-moss border-2 border-jade/30 text-gray-400"
                  }`}
                >
                  {isCompleted ? "✓" : step.number}
                </div>

                {/* Label: Hidden on very small screens, shown on tablets up */}
                <span
                  className={`hidden md:block mt-2 text-sm font-medium transition-colors duration-300 text-center whitespace-nowrap ${
                    isCompleted || isCurrent ? "text-white" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>

                {/* Mobile-only active indicator dot (optional) */}
                {isCurrent && (
                  <div className="md:hidden mt-1 w-1 h-1 rounded-full bg-jade animate-pulse" />
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 md:h-1 mx-2 md:mx-4 relative bg-moss rounded">
                  <div
                    className="absolute inset-0 bg-emerald rounded transition-all duration-500"
                    style={{ width: isCompleted ? "100%" : "0%" }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile-only Title Display: Shows the current step title since labels are hidden */}
      <div className="md:hidden text-center mt-4">
        <p className="text-jade font-bold text-xs uppercase tracking-[0.2em]">
          Step {currentStep}:{" "}
          {steps.find((s) => s.number === currentStep)?.title}
        </p>
      </div>
    </div>
  );
};
