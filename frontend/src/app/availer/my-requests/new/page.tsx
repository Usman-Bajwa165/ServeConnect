'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AiSuggestionInput } from '@/components/ai/AiSuggestionInput';
import { PAKISTAN_CITIES } from '@/lib/cities';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import axios from '@/lib/axios';

export default function NewRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFixingGrammar, setIsFixingGrammar] = useState(false);

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

  const handleDescriptionBlur = async () => {
    if (!formData.description.trim()) return;
    
    setIsFixingGrammar(true);
    try {
      const res = await axios.post('/ai/suggest', {
        type: 'grammar',
        text: formData.description,
      });
      if (res.data?.data?.suggestion) {
        setFormData(prev => ({ ...prev, description: res.data.data.suggestion }));
      }
    } catch (err) {
      console.warn('Grammar check failed');
    } finally {
      setIsFixingGrammar(false);
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
    <DashboardLayout 
      title="Post New Request" 
      subtitle="Post a job so professionals can help you"
    >
      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 pt-12 relative overflow-hidden animate-slide-up">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-500 to-accent-500"></div>

          <button 
             onClick={() => router.back()}
             className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all group shadow-sm bg-gray-50 border border-gray-100"
             title="Close"
          >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm border-l-4 border-red-400 font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 relative">
                 <Input
                   label="Job Title"
                   name="title"
                   value={formData.title}
                   onChange={handleChange}
                   required
                   placeholder="e.g. Need a skilled electrician, Interior designer..."
                   className="text-lg font-medium"
                 />
              </div>

              <div className="md:col-span-2">
                 <div className="relative">
                   <AiSuggestionInput
                     label="Job Description"
                     value={formData.description}
                     onChange={handleDescriptionChange}
                     onBlur={handleDescriptionBlur}
                     contextType="description"
                     titleContext={formData.title}
                     placeholder="Detail your requirements here..."
                     required
                     className="min-h-[160px]"
                   />
                   {isFixingGrammar && (
                     <div className="absolute top-0 right-0 mt-1 mr-2 flex items-center gap-1.5 text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100 animate-pulse">
                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        AI Checking Grammar...
                     </div>
                   )}
                 </div>
                 <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Press Tab for suggestions. Grammar checked automatically on exit.
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
                   <SearchableSelect
                     options={PAKISTAN_CITIES}
                     value={formData.location}
                     onChange={(val) => setFormData({ ...formData, location: val })}
                     placeholder="Search and select a city..."
                     name="location"
                   />
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
