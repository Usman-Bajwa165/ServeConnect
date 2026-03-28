'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PAKISTAN_CITIES } from '@/lib/cities';

interface SearchableCitySelectProps {
  value: string;
  onChange: (city: string) => void;
  placeholder?: string;
  icon?: boolean;
}

export const SearchableCitySelect = ({ value, onChange, placeholder = "Select City", icon = true }: SearchableCitySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredCities = PAKISTAN_CITIES.filter(city => 
    city.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      )}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border border-gray-300 rounded-lg ${icon ? 'pl-10' : 'pl-4'} pr-10 py-2.5 shadow-sm cursor-pointer transition-all hover:border-brand-500 flex items-center justify-between min-h-[46px] ${isOpen ? 'ring-4 ring-brand-500/10 border-brand-500' : ''}`}
      >
        <span className={value ? "text-gray-900 font-semibold" : "text-gray-400 font-medium"}>
          {value || placeholder}
        </span>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl animate-fade-in overflow-hidden">
          <div className="p-3 border-b border-gray-100 bg-gray-50/50">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                placeholder="Search city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {filteredCities.length > 0 ? (
              <>
                {value && (
                   <div 
                    onClick={() => { onChange(''); setIsOpen(false); setSearch(''); }}
                    className="px-4 py-2.5 text-sm text-red-600 font-bold hover:bg-red-50 cursor-pointer flex items-center gap-2 border-b border-gray-50"
                  >
                    Clear Selection
                  </div>
                )}
                {filteredCities.map((city) => (
                  <div 
                    key={city}
                    onClick={() => {
                      onChange(city);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${value === city ? 'bg-brand-50 text-brand-700 font-black' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {city}
                    {value === city && (
                      <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div className="px-4 py-8 text-center text-gray-400 text-sm italic">
                {`No cities found matching "${search}"`}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
