'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ProviderNavTabs } from '@/components/layout/ProviderNavTabs';
import { SearchBar } from '@/components/search/SearchBar';
import { CityFilter } from '@/components/search/CityFilter';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ApplyModal } from '@/components/applications/ApplyModal';
import axios from '@/lib/axios';

export default function ProviderDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/avail-requests', {
        params: { search, city }
      });
      setRequests(res.data.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Provider Dashboard</h1>
        <p className="mt-2 text-gray-600">Browse and apply to service requests posted by users.</p>
      </div>

      <ProviderNavTabs />

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search requests by title..." />
        </div>
        <div className="w-full sm:w-64">
          <CityFilter value={city} onChange={setCity} />
        </div>
        <button 
          onClick={fetchRequests}
          className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium whitespace-nowrap shadow-sm hover:shadow"
        >
          Search
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-sm">
          <p className="text-green-800 font-medium">{successMsg}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <Card key={i} className="animate-pulse bg-white/50 border-gray-100 h-64 border-dashed" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 border-dashed">
          <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">No requests found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or city filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {requests.map((req) => (
            <Card key={req.id} hover className="h-full flex flex-col group hover:border-brand-200">
              <CardContent className="flex flex-col flex-1 p-6 relative">
                 <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">{req.title}</h3>
                    <Badge variant="info" className="whitespace-nowrap flex-shrink-0 ml-2 shadow-sm font-semibold text-brand-700 bg-brand-50 border-brand-200">Rs {req.price}</Badge>
                 </div>
                 
                 <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-1 leading-relaxed">{req.description}</p>
                 
                 <div className="flex items-center gap-2 mb-6 bg-gray-50 py-2 px-3 rounded-lg border border-gray-100 shadow-inner">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm shadow-sm">
                      {req.availer.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5 leading-none">Posted By</p>
                      <p className="text-sm font-bold text-gray-800 leading-none">{req.availer.fullName}</p>
                    </div>
                 </div>
                 
                 <div className="border-t border-gray-100 pt-4 flex items-center justify-between mt-auto">
                    <span className="text-gray-500 text-sm flex items-center gap-1 font-medium bg-white px-2 py-1 rounded shadow-sm border border-gray-100">
                       <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                       {req.location}
                    </span>
                    <button
                      onClick={() => setActiveRequest(req)}
                      className="bg-brand-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-brand-700 hover:shadow-md transition-all text-sm focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                    >
                      Apply Now
                    </button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeRequest && (
        <ApplyModal
          isOpen={true}
          onClose={() => setActiveRequest(null)}
          targetId={activeRequest.id}
          targetTitle={activeRequest.title}
          type="avail-request"
          onSuccess={() => {
            setSuccessMsg(`Successfully applied to "${activeRequest.title}". Check Pending Jobs to monitor status.`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </DashboardLayout>
  );
}
