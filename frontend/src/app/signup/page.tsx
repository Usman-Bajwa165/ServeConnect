'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import axios from '@/lib/axios';
import { setAuth, getDashboardPath } from '@/lib/auth';
import { PAKISTAN_CITIES } from '@/lib/cities';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFromQuery = searchParams.get('role');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
    <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-${roleTheme}-50`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in relative z-10">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 flex flex-col items-center gap-2">
          Create your account
          <Badge variant={isProvider ? 'warning' : 'info'} className="mt-2 text-sm px-4 py-1">
            {displayRole}
          </Badge>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/login" className={`font-medium text-${roleTheme}-600 hover:text-${roleTheme}-500 transition-colors`}>
            log in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-slide-up relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100 glass-panel">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
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
            />

            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
            />

            <div className="w-full flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.2em_1.2em] transition-all cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")` }}
              >
                <option value="" disabled>Select your city...</option>
                {PAKISTAN_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full shadow-lg hover:shadow-xl transition-all" 
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
