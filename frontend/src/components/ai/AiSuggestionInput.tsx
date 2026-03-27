import React, { forwardRef, TextareaHTMLAttributes } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useAiSuggestion } from '@/hooks/useAiSuggestion';

interface AiSuggestionInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  contextType: 'description' | 'continuation';
  titleContext?: string;
  label: string;
}

export const AiSuggestionInput = forwardRef<HTMLTextAreaElement, AiSuggestionInputProps>(
  ({ value, onChange, contextType, titleContext, label, className = '', ...props }, ref) => {
    
    // Check if the user is typing to avoid querying on every render
    const [isTyping, setIsTyping] = React.useState(false);
    const debouncedValue = useDebounce(value, 600);
    
    const { suggestion, acceptSuggestion, clearSuggestion } = useAiSuggestion({
      type: contextType,
      text: debouncedValue,
      title: titleContext,
      enabled: isTyping && value === debouncedValue,
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab' && suggestion) {
        e.preventDefault();
        const newValue = acceptSuggestion();
        // Fire a synthetic event to update parent state
        const event = {
          target: { value: newValue }
        } as React.ChangeEvent<HTMLTextAreaElement>;
        onChange(event);
      } else if (e.key === 'Escape') {
        clearSuggestion();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setIsTyping(true);
      clearSuggestion();
      onChange(e);
    };

    return (
      <div className="relative flex flex-col w-full">
        <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
        
        <div className="relative w-full">
          <textarea
            ref={ref}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsTyping(false)}
            className={`w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all resize-y min-h-[120px] ${className}`}
            {...props}
          />
          
          {/* Ghost Text Overlay */}
          {suggestion && isTyping && (
            <div 
              className="absolute pointer-events-none p-3 inset-0 overflow-hidden whitespace-pre-wrap break-words"
              aria-hidden="true"
            >
              <span className="opacity-0">{value}</span>
              <span className="text-gray-400 font-mono text-sm ml-1 select-none animate-pulse-slow">
                {suggestion} <span className="text-xs bg-gray-100 rounded px-1 ml-1">Tab</span>
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

AiSuggestionInput.displayName = 'AiSuggestionInput';
