'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { AvailerNavTabs } from '@/components/layout/AvailerNavTabs';
import { SearchBar } from '@/components/search/SearchBar';
import { CityFilter } from '@/components/search/CityFilter';
import { Card, CardContent } from '@/components/ui/Card';
import { StarRating } from '@/components/reviews/StarRating';
import { Badge } from '@/components/ui/Badge';
import axios from '@/lib/axios';

export default function AvailerDashboard() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');

  // Not using useDebounce simply to show real-time button click search, but will auto-fetch on city change
  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/users/providers', {
        params: { search, city }
      });
      setProviders(res.data.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Availer Dashboard</h1>
        <p className="mt-2 text-gray-600">Find the perfect professional for your needs.</p>
      </div>

      <AvailerNavTabs />

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search providers by name..." />
        </div>
        <div className="w-full sm:w-64">
          <CityFilter value={city} onChange={setCity} />
        </div>
        <button 
          onClick={fetchProviders}
          className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium whitespace-nowrap shadow-sm hover:shadow"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <Card key={i} className="animate-pulse bg-white/50 border-gray-100 h-64 border-dashed" />
          ))}
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 border-dashed">
          <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">No providers found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or city filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {providers.map((p) => (
            <Link key={p.id} href={`/availer/provider/${p.id}`} className="block h-full group">
              <Card hover className="h-full flex flex-col group-hover:border-brand-200">
                <CardContent className="flex flex-col flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center text-brand-700 font-bold text-xl border-2 border-white shadow-md group-hover:scale-110 transition-transform">
                        {p.fullName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-brand-600 transition-colors">{p.fullName}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {p.city}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-4 flex-1">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Reputation</span>
                       <StarRating rating={p.averageRating} />
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Reviews</span>
                       <span className="text-sm font-medium text-gray-700">{p.reviewCount} total</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <Badge variant="info" className="px-3 py-1">
                      {p.serviceCount} services offered
                    </Badge>
                    <span className="text-brand-600 text-sm font-medium flex items-center opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                      View Profile <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
