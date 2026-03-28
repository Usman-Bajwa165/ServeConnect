'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import axios from '@/lib/axios';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users');
      setUsers(res.data.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBan = async (id: string, currentlyBanned: boolean) => {
    try {
      await axios.patch(`/admin/users/${id}/ban`, { isBanned: !currentlyBanned });
      fetchUsers();
    } catch (err) {
      alert('Failed to update ban status');
    }
  };

  return (
    <DashboardLayout 
      title="User Management"
      subtitle="Oversee and manage platform users and their access."
    >
      <div className="w-full h-full p-0 flex flex-col">
        <div className="p-6 lg:p-8 flex items-center justify-between border-b border-gray-100 bg-white">
          <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium transition-colors group">
             <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             Back to Dashboard
          </Link>
          <div className="text-sm font-bold text-brand-600 px-4 py-1.5 bg-brand-50 rounded-full border border-brand-100 shadow-sm">
             {users.length} Total Users Found
          </div>
        </div>

      {loading ? (
         <div className="p-8 animate-pulse flex flex-col gap-4">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-20 bg-gray-50 rounded-xl border border-gray-100"></div>)}
         </div>
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col h-[calc(100vh-180px)] bg-white">
           <div className="overflow-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
             <table className="min-w-full divide-y divide-gray-200 relative">
               <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                 <tr className="bg-gray-50 backdrop-blur-md">
                   <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200">User</th>
                   <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200">Role</th>
                   <th scope="col" className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200">Status</th>
                   <th scope="col" className="px-8 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200">Actions</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-100">
                 {users.map((user) => (
                   <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center">
                         <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-700">
                           {user.fullName.charAt(0)}
                         </div>
                         <div className="ml-4">
                           <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                           <div className="text-sm text-gray-500">{user.email} • {user.city}</div>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <Badge variant={user.role === 'ADMIN' ? 'danger' : user.role === 'SERVICE_PROVIDER' ? 'warning' : 'info'}>
                          {user.role}
                       </Badge>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       {user.isBanned ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Banned
                          </span>
                       ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                       )}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       {user.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleToggleBan(user.id, user.isBanned)}
                            className={`${user.isBanned ? 'text-green-600 hover:text-green-900 bg-green-50' : 'text-red-600 hover:text-red-900 bg-red-50'} px-3 py-1.5 rounded-md hover:shadow-sm transition-all focus:outline-none`}
                          >
                            {user.isBanned ? 'Unban User' : 'Ban User'}
                          </button>
                       )}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
}
