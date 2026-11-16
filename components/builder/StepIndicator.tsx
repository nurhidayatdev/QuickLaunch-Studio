import React from "react";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  steps: {
    title: string;
    description?: string;
  }[];
}

export default function StepIndicator({
  currentStep,
  steps,
}: StepIndicatorProps) {
  return (
    <div className="w-full bg-white border-b border-slate-200 px-4 py-3 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Langkah {currentStep} dari {steps.length}
            </span>
            <span className="text-sm font-medium text-slate-800 hidden sm:inline">
              {steps[currentStep - 1]?.title}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {steps.map((step, idx) => {
              const stepNumber = idx + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;

              return (
                <div key={idx} className="flex items-center gap-1.5">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isCompleted ? <Check className="h-3.5 w-3.5" /> : stepNumber}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-1 w-4 sm:w-8 rounded-full ${
                        stepNumber < currentStep ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

