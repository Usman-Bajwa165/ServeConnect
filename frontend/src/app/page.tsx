'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-brand-100 selection:text-brand-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight text-gray-900 group">
            <span className="text-brand-600 transition-colors group-hover:text-brand-700">Serve</span>Connect
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-brand-600 transition-colors">
              Sign in
            </Link>
            <Link href="/signup">
              <Button size="sm" className="rounded-full px-5">Join Now</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-20 -right-4 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow delay-1000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
              Connect with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-500">Excellence</span> in your City.
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              The premier marketplace for top-tier service professionals and those who demand the best. Smart, secure, and seamless.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup?role=SERVICE_AVAILER" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-8 py-4 text-lg shadow-xl shadow-brand-200">
                  Find a Professional
                </Button>
              </Link>
              <Link href="/signup?role=SERVICE_PROVIDER" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 py-4 text-lg bg-gray-50/50">
                  Earn with your Skills
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection section */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Path</h2>
            <div className="w-20 h-1.5 bg-brand-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Link href="/signup?role=SERVICE_AVAILER" className="group">
              <Card className="h-full border-none shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-2 h-full bg-brand-600"></div>
                <CardContent className="p-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 text-brand-600 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Post & Find Services</h3>
                  <p className="text-gray-600 leading-relaxed mb-8 flex-grow">
                    Join as an <strong className="text-brand-700">Availer</strong>. Post your needs, review applications, and book the perfect professional for your task.
                  </p>
                  <span className="flex items-center gap-2 font-bold text-brand-600 uppercase tracking-widest text-xs">
                    Start Browsing <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                </CardContent>
              </Card>
            </Link>

            <Link href="/signup?role=SERVICE_PROVIDER" className="group">
              <Card className="h-full border-none shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-2 h-full bg-accent-500"></div>
                <CardContent className="p-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-accent-50 rounded-2xl flex items-center justify-center mb-6 text-accent-600 group-hover:scale-110 group-hover:bg-accent-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Become a Provider</h3>
                  <p className="text-gray-600 leading-relaxed mb-8 flex-grow">
                    Ready to work? Join as a <strong className="text-accent-700">Provider</strong>. Showcase your expertise and get hired for premium jobs in your city.
                  </p>
                  <span className="flex items-center gap-2 font-bold text-accent-600 uppercase tracking-widest text-xs">
                    List Your Skills <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-black text-gray-900 mb-8 leading-tight">Fast. Professional.<br /><span className="text-brand-600">Smart.</span></h2>
              <div className="space-y-8">
                {[
                  { title: "Smart Suggest", desc: "Our AI helps you draft the perfect request for any service needs instantly.", icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" /> },
                  { title: "Direct Contact", desc: "Communication is key. Connect directly with people in your same city.", icon: <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> },
                  { title: "Build Reputation", desc: "Trust is earned. Use our peer-review system to build a name for yourself.", icon: <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /> }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-brand-600">
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{item.icon}</svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 relative">
               <div className="bg-brand-600 rounded-2xl w-full h-[400px] shadow-2xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-indigo-600 opacity-90"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                         <svg className="w-8 h-8" fill="white" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                      </div>
                      <p className="text-2xl font-bold mb-2">See how it works</p>
                      <p className="text-white/80">Experience the future of local services</p>
                  </div>
               </div>
               <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 hidden lg:block">
                  <div className="flex items-center gap-3">
                     <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200"></div>)}
                     </div>
                     <p className="text-sm font-bold text-gray-900">Join 10,000+ users</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-brand-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Active Users", val: "50k+" },
              { label: "Tasks Completed", val: "120k+" },
              { label: "Verified Pros", val: "5k+" },
              { label: "Success Rate", val: "99.2%" }
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl md:text-5xl font-black mb-2 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>{stat.val}</p>
                <p className="text-brand-300 font-medium uppercase tracking-widest text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                 <h2 className="text-2xl font-bold text-white mb-6">ServeConnect</h2>
                 <p className="max-w-xs leading-relaxed">Making city services professional, accessible, and fast for everyone. Join our community today.</p>
              </div>
              <div>
                 <h4 className="text-white font-bold mb-6">Platform</h4>
                 <ul className="space-y-4 text-sm">
                   <li><Link href="/login" className="hover:text-white transition-colors">Sign in</Link></li>
                   <li><Link href="/signup" className="hover:text-white transition-colors">Create account</Link></li>
                   <li><Link href="#" className="hover:text-white transition-colors">Safety Center</Link></li>
                 </ul>
              </div>
              <div>
                 <h4 className="text-white font-bold mb-6">Support</h4>
                 <ul className="space-y-4 text-sm">
                   <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                   <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
                   <li><Link href="#" className="hover:text-white transition-colors">Terms of Use</Link></li>
                 </ul>
              </div>
           </div>
           <div className="pt-8 border-t border-gray-800 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
              <p>&copy; {new Date().getFullYear()} ServeConnect Inc. All rights reserved.</p>
              <div className="flex gap-6">
                 <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                 <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}

