'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SearchableCitySelect } from '@/components/ui/SearchableCitySelect';
import axios from '@/lib/axios';
import { setAuth, getDashboardPath } from '@/lib/auth';
import { PAKISTAN_CITIES } from '@/lib/cities';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFromQuery = searchParams.get('role');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: roleFromQuery === 'SERVICE_PROVIDER' ? 'SERVICE_PROVIDER' : 'SERVICE_AVAILER',
    city: '',
  });

  useEffect(() => {
    if (roleFromQuery && (roleFromQuery === 'SERVICE_PROVIDER' || roleFromQuery === 'SERVICE_AVAILER')) {
      setFormData(prev => ({ ...prev, role: roleFromQuery }));
    }
  }, [roleFromQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!formData.city) {
      setError('Please select a city');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('/auth/signup', formData);
      const { user, access_token } = res.data.data;
      
      setAuth(access_token, user);
      
      router.push(getDashboardPath(user.role));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isProvider = formData.role === 'SERVICE_PROVIDER';
  const displayRole = isProvider ? 'Service Provider' : 'Service Availer';
  const roleTheme = isProvider ? 'accent' : 'brand';

  return (
    <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-${roleTheme === 'brand' ? 'brand-50' : 'accent-50'}`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in relative z-10 px-4">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-brand-600 transition-colors mb-6 group">
          <svg className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <h2 className="text-center text-3xl font-extrabold text-gray-900 flex flex-col items-center gap-2">
          Create account
          <Badge variant={isProvider ? 'warning' : 'info'} className="mt-2 text-sm px-4 py-1">
            {displayRole}
          </Badge>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/login" className={`font-medium text-${roleTheme}-600 hover:text-${roleTheme}-500 transition-colors underline-offset-4 decoration-current`}>
            log in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-slide-up relative z-10 px-4">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100 glass-panel">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md animate-fade-in">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Input
              label="Full Name"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. John Doe, Ayesha Khan"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            />

            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            />

            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  )}
                </button>
              }
            />

            <div className="w-full flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">City</label>
              <SearchableCitySelect 
                value={formData.city} 
                onChange={(city) => setFormData(prev => ({ ...prev, city }))} 
              />
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200" 
                variant={isProvider ? 'secondary' : 'primary'}
                isLoading={loading} 
                size="lg"
              >
                Sign up
              </Button>
            </div>
            
            <div className="text-center pt-2">
               <Link href="/" className="text-xs text-gray-500 hover:text-gray-900 underline underline-offset-2">Wrong role? Change to {isProvider ? 'Service Availer' : 'Service Provider'}</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
