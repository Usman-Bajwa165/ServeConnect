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
      setUsers(res.data.data);
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
    <DashboardLayout>
      <div className="mb-8">
        <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium transition-colors mb-4">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
           Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
      </div>

      {loading ? (
         <div className="animate-pulse flex flex-col gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-16 bg-white rounded-lg border border-gray-100"></div>)}
         </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden animate-slide-up">
           <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                 <tr>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                   <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
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
    </DashboardLayout>
  );
}
