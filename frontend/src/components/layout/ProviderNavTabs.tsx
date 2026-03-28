import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ProviderNavTabs = () => {
  const pathname = usePathname();

  const tabs = [
    { name: "Browse Requests", href: "/provider/dashboard" },
    { name: "My Services", href: "/provider/services" },
    { name: "Applied", href: "/provider/applied" },
    { name: "Pending Jobs", href: "/provider/pending-jobs" },
  ];

  return (
    <div className="border-b border-gray-200 mb-6 bg-white rounded-t-xl sticky top-[64px] z-10 shadow-sm px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav className="-mb-px flex flex-wrap" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive =
              pathname === tab.href ||
              (pathname.startsWith("/provider/services") &&
                tab.href === "/provider/services");
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? "border-brand-500 text-brand-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
        <div className="py-2 sm:py-0">
          <Link href="/provider/services/new">
            <button className="inline-flex items-center px-4 py-2 bg-accent-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-accent-700 transition-all shadow-md active:scale-95">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Skill/Service
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
