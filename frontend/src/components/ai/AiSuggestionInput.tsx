import React, { forwardRef, TextareaHTMLAttributes } from 'react';

interface AiSuggestionInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
  // Kept for prop compatibility with pages, but no longer used for ghost-text
  contextType?: 'description' | 'continuation' | 'grammar';
  titleContext?: string;
}

export const AiSuggestionInput = forwardRef<HTMLTextAreaElement, AiSuggestionInputProps>(
  ({ value, onChange, label, className = '', ...props }, ref) => {
    return (
      <div className="relative flex flex-col w-full group">
        <label className="mb-1 text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-brand-600">
           {label}
        </label>
        
        <div className="relative w-full">
          <textarea
            ref={ref}
            value={value}
            onChange={onChange}
            className={`w-full p-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-y min-h-[140px] text-gray-800 placeholder-gray-400 font-sans ${className}`}
            {...props}
          />
        </div>
      </div>
    );
  }
);

AiSuggestionInput.displayName = 'AiSuggestionInput';
