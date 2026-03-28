import React from 'react';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <Header title={title} subtitle={subtitle} />
      <main className="flex-grow w-full px-0 py-0 animate-fade-in flex flex-col">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-auto py-4 px-6">
        <div className="w-full flex justify-between items-center text-gray-500 text-xs font-medium tracking-wide">
          <span>&copy; {new Date().getFullYear()} ServeConnect. Premium Platform.</span>
          <div className="flex gap-4">
             <span className="hover:text-brand-600 cursor-pointer">Terms</span>
             <span className="hover:text-brand-600 cursor-pointer">Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
