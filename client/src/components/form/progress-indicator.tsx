import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  totalSteps, 
  onBack, 
  className = '' 
}) => {
  return (
    <div className={`mb-10 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <React.Fragment key={index}>
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center font-medium
                ${index < currentStep 
                  ? 'bg-[#322459] text-white' 
                  : 'border border-gray-300 text-gray-700'}
              `}>
                {index + 1}
              </div>
              
              {index < totalSteps - 1 && (
                <div className={`
                  h-0.5 w-16 mx-2
                  ${index < currentStep - 1 ? 'bg-[#322459]' : 'bg-gray-200'}
                `} />
              )}
            </React.Fragment>
          ))}
        </div>
        
        {onBack && currentStep > 1 && (
          <button 
            type="button" 
            onClick={onBack}
            className="text-[#322459] font-medium flex items-center hover:underline focus:outline-none transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default ProgressIndicator;
