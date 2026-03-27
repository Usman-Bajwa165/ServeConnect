'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import axios from '@/lib/axios';

export default function AdminDashboardPage() {
  const router = useRouter();

  const handleCreateMockProvider = async () => {
    try {
      await axios.post('/auth/signup', {
         email: `provider_${Date.now()}@example.com`,
         password: 'password123',
         fullName: `Mock Provider ${Math.floor(Math.random() * 100)}`,
         role: 'SERVICE_PROVIDER',
         city: 'Lahore'
      });
      alert('Mock provider created (check DB). You can login as admin back.');
    } catch {}
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">System overview and moderation controls.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
         <Link href="/admin/users" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:border-brand-300 group">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 leading-none">Manage Users</h3>
            <p className="text-gray-500 text-sm">View all users, providers, and availers. Ban or unban active instances.</p>
         </Link>

         <Link href="/admin/services" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:border-green-300 group">
            <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 leading-none">Provider Services</h3>
            <p className="text-gray-500 text-sm">Moderate all listed services from providers across the platform.</p>
         </Link>

         <Link href="/admin/requests" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:border-orange-300 group">
            <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 leading-none">Avail Requests</h3>
            <p className="text-gray-500 text-sm">Review and remove inappropriate requests posted by users.</p>
         </Link>
      </div>
      
    </DashboardLayout>
  );
}
