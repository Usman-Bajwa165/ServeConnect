'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AiSuggestionInput } from '@/components/ai/AiSuggestionInput';
import { PAKISTAN_CITIES } from '@/lib/cities';
import axios from '@/lib/axios';

export default function NewRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
     setFormData({ ...formData, description: e.target.value });
  };
  
  const handleTitleBlur = async () => {
    // Automatically fetch AI description suggestion when title loses focus, if description is empty
    if (formData.title.trim() && !formData.description.trim()) {
      try {
        const res = await axios.post('/ai/suggest', {
          type: 'description',
          title: formData.title,
          text: '',
        });
        if (res.data?.data?.suggestion) {
          setFormData(prev => ({ ...prev, description: res.data.data.suggestion }));
        }
      } catch (err) {
        // Silently fail AI on blur
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.location) {
      setError('Location is required');
      setLoading(false);
      return;
    }

    try {
      await axios.post('/avail-requests', {
        ...formData,
        price: Number(formData.price),
      });
      router.push('/availer/my-requests');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create request');
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
           <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium transition-colors mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to My Requests
           </button>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Post New Request</h1>
           <p className="mt-2 text-gray-600">Describe the job you need done so professionals can review your requirements and apply.</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 pt-10 relative overflow-hidden animate-slide-up">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-500 to-accent-500"></div>
          
          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm border-l-4 border-red-400 font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                 <Input
                   label="Job Title"
                   name="title"
                   value={formData.title}
                   onChange={handleChange}
                   onBlur={handleTitleBlur}
                   required
                   placeholder="e.g. Need a skilled electrician, Interior designer..."
                   className="text-lg font-medium"
                 />
              </div>

              <div className="md:col-span-2">
                 <AiSuggestionInput
                   label="Job Description"
                   value={formData.description}
                   onChange={handleDescriptionChange}
                   contextType="description"
                   titleContext={formData.title}
                   placeholder="Detail your requirements here..."
                   required
                   className="min-h-[160px]"
                 />
                 <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Hit Tab while typing for AI autocomplete.
                 </p>
              </div>

              <div className="relative">
                 <Input
                   label="Your Budget (Rs)"
                   name="price"
                   type="number"
                   min="0"
                   step="0.01"
                   value={formData.price}
                   onChange={handleChange}
                   required
                   placeholder="0.00"
                   icon={<span className="font-semibold text-gray-500">Rs</span>}
                 />
              </div>

              <div className="w-full flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-500">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                   </div>
                   <select
                     name="location"
                     value={formData.location}
                     onChange={handleChange}
                     required
                     className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.2em_1.2em] transition-all"
                     style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")` }}
                   >
                     <option value="" disabled>Select your city</option>
                     {PAKISTAN_CITIES.map((city) => (
                       <option key={city} value={city}>{city}</option>
                     ))}
                   </select>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" isLoading={loading} size="lg" className="px-8 shadow-md">Post Request</Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
