'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse-slow"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-accent-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse-slow delay-1000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse-slow delay-2000"></div>
      
      <div className="z-10 text-center mb-12 animate-slide-up">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          <span className="text-brand-600">Serve</span>Connect
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
          The smart marketplace connecting top-tier service professionals with those who need them.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full z-10 animate-fade-in relative">
        <Link href="/signup?role=SERVICE_AVAILER" className="block w-full">
          <Card className="h-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-brand-200 bg-white/80 backdrop-blur-sm cursor-pointer group">
            <CardContent className="p-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-6 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">I need a service</h2>
              <p className="text-gray-600 mb-6 flex-grow">
                Sign up as a <span className="font-semibold text-brand-700">Service Availer</span> to browse professionals or post your specific requests.
              </p>
              <span className="text-brand-600 font-semibold group-hover:underline flex items-center gap-1">
                Get started <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/signup?role=SERVICE_PROVIDER" className="block w-full">
          <Card className="h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-accent-200 bg-white/80 backdrop-blur-sm cursor-pointer group">
            <CardContent className="p-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mb-6 text-accent-600 group-hover:bg-accent-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">I offer services</h2>
              <p className="text-gray-600 mb-6 flex-grow">
                Sign up as a <span className="font-semibold text-accent-700">Service Provider</span> to list your skills and find jobs in your area.
              </p>
              <span className="text-accent-600 font-semibold group-hover:underline flex items-center gap-1">
                Get started <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </span>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-16 text-center z-10 animate-fade-in delay-500">
        <p className="text-gray-500 mb-3">Already have an account?</p>
        <Link href="/login" className="inline-flex items-center justify-center px-6 py-2.5 bg-white border border-gray-300 rounded-full text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm transition-colors">
          Log in
        </Link>
      </div>
    </div>
  );
}
