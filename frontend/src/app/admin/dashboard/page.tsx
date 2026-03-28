'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import axios from '@/lib/axios';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/users/me/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <DashboardLayout 
      title="Admin Dashboard"
      subtitle="System overview and platform moderation controls."
    >
      <div className="w-full h-full p-6 lg:p-10">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total Users', val: stats?.totalUsers ?? '...', color: 'blue', icon: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> },
          { label: 'Active Listings', val: stats?.totalServices ?? '...', color: 'green', icon: <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /> },
          { label: 'Pending Help', val: stats?.totalRequests ?? '...', color: 'orange', icon: <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /> }
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 group cursor-default ${loading ? 'animate-pulse' : ''}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-${stat.color}-600 bg-${stat.color}-50 group-hover:scale-110 transition-transform`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{stat.icon}</svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900 leading-none">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 px-1">Moderation Tools</div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
         <Link href="/admin/users" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:border-blue-300 group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Users</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">Complete control over the user base. Oversee providers and availers accounts.</p>
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">Go to users <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></span>
         </Link>

         <Link href="/admin/services" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:border-green-300 group">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Services Audit</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">Review all skills and packages offered by providers across all categories.</p>
            <span className="text-green-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">Go to products <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></span>
         </Link>

         <Link href="/admin/requests" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:border-orange-300 group">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Request Feed</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">Moderate the public request feed. Ensure all posts comply with community guidelines.</p>
            <span className="text-orange-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">Go to feed <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></span>
         </Link>
      </div>
      </div>
    </DashboardLayout>
  );
}
