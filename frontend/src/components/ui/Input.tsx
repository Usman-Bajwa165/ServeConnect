import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, rightElement, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="relative group">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-500 transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-white border rounded-lg px-3 py-2.5 shadow-sm focus:outline-none focus:ring-4 transition-all duration-200 ${
              icon ? 'pl-10' : ''
            } ${
              rightElement ? 'pr-10' : ''
            } ${
              error
                ? 'border-red-500 focus:ring-red-100 focus:border-red-500 text-red-900 placeholder-red-300'
                : 'border-gray-300 focus:ring-brand-500/10 focus:border-brand-500 text-gray-900 placeholder-gray-400'
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-600 animate-fade-in">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
