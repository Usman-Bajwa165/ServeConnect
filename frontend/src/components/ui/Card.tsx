import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  hover?: boolean;
}

export const Card = ({ children, className = '', hover = false, ...props }: CardProps) => (
  <div 
    {...props}
    className={`bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col ${hover ? 'transition-all hover:shadow-lg hover:-translate-y-1' : ''} ${className}`}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className={`p-5 border-b border-gray-100 flex items-center justify-between ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 {...props} className={`text-lg font-semibold text-gray-900 leading-tight ${className}`}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className={`p-5 flex-grow ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className={`p-5 border-t border-gray-50 bg-gray-50/50 flex items-center gap-3 ${className}`}>
    {children}
  </div>
);
