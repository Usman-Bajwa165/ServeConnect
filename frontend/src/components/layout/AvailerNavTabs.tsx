import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const AvailerNavTabs = () => {
  const pathname = usePathname();
  
  const tabs = [
    { name: 'Browse Providers', href: '/availer/dashboard' },
    { name: 'Availed Services', href: '/availer/availed' },
    { name: 'My Requests', href: '/availer/my-requests' },
  ];

  return (
    <div className="border-b border-gray-200 mb-6 bg-white rounded-t-xl sticky top-0 z-10 shadow-sm">
      <nav className="-mb-px flex flex-wrap" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
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
