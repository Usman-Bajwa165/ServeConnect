import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const ProviderNavTabs = () => {
  const pathname = usePathname();
  
  const tabs = [
    { name: 'Browse Requests', href: '/provider/dashboard' },
    { name: 'My Services', href: '/provider/services' },
    { name: 'Pending Jobs', href: '/provider/pending-jobs' },
  ];

  return (
    <div className="border-b border-gray-200 mb-6 bg-white rounded-t-xl sticky top-0 z-10 shadow-sm">
      <nav className="-mb-px flex flex-wrap" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (pathname.startsWith('/provider/services') && tab.href === '/provider/services');
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                isActive
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
