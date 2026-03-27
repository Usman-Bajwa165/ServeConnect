import React from 'react';
import { PAKISTAN_CITIES } from '@/lib/cities';

interface CityFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const CityFilter = ({ value, onChange, className = '' }: CityFilterProps) => (
  <div className={`relative ${className}`}>
     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-lg shadow-sm appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.2em_1.2em] transition-all bg-white"
      style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")` }}
    >
      <option value="">All Cities</option>
      {PAKISTAN_CITIES.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  </div>
);
