import React from "react";

interface Step {
  number: number;
  title: string;
}

interface ProgressStepsProps {
  currentStep: number;
  steps: Step[];
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  currentStep,
  steps,
}) => {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isUpcoming = currentStep < step.number;

          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    isCompleted
                      ? "bg-emerald text-white scale-110"
                      : isCurrent
                        ? "bg-jade text-white shadow-lg shadow-jade/50"
                        : "bg-moss border-2 border-jade/30 text-gray-400"
                  }`}
                >
                  {isCompleted ? "✓" : step.number}
                </div>
                <span
                  className={`mt-2 text-sm font-medium transition-colors duration-300 text-center whitespace-nowrap${
                    isCompleted || isCurrent ? " text-white" : " text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className="flex-1 h-1 mx-4 relative"
                  style={{ maxWidth: "100px" }}
                >
                  <div className="absolute inset-0 bg-moss rounded"></div>
                  <div
                    className={`absolute inset-0 bg-emerald rounded transition-all duration-500 ${
                      isCompleted ? "w-full" : "w-0"
                    }`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
