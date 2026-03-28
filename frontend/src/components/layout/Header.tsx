"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardPath } from "@/lib/auth";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

import { NotificationBell } from "./NotificationBell";

export default function Header({ title, subtitle }: HeaderProps) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-brand-400 via-brand-600 to-accent-600" />
      
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
        <div className="w-full px-6 lg:px-10">
          <div className="flex justify-between items-center h-20 gap-8">
            
            {/* Logo Section */}
            <div className="flex min-w-[180px]">
              <Link 
                href={getDashboardPath(user.role)} 
                className="flex items-center gap-3 group transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:shadow-brand-500/30 transition-all">
                  S
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-gray-900 tracking-tighter leading-none">
                    Serve<span className="text-brand-600">Connect</span>
                  </span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">
                    Premium Services
                  </span>
                </div>
              </Link>
            </div>

            {/* Dynamic Title Section */}
            {title && (
              <div className="hidden lg:flex flex-1 flex-col items-center justify-center max-w-xl">
                 <div className="bg-gray-50/50 px-6 py-2 rounded-full border border-gray-100/50 shadow-inner flex flex-col items-center">
                    <h2 className="text-[11px] font-black text-brand-600 tracking-[0.25em] uppercase animate-fade-in mb-0.5">
                      {title}
                    </h2>
                    {subtitle && (
                      <p className="text-[9px] font-bold text-gray-400 text-center uppercase tracking-widest opacity-60 truncate">
                        {subtitle}
                      </p>
                    )}
                 </div>
              </div>
            )}

            {/* User Actions */}
            <div className="flex items-center gap-2 sm:gap-6 min-w-[200px] justify-end">
              <div className="hidden sm:block">
                <NotificationBell />
              </div>
              
              <div className="hidden sm:flex items-center gap-4 pl-6 border-l border-gray-100">
                <Link
                  href="/profile"
                  className="flex flex-col items-end hover:opacity-80 transition-opacity"
                >
                  <span className="text-sm font-black text-gray-900 leading-none mb-1.5 uppercase tracking-tighter">
                    {user.fullName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      {user.role.replace("_", " ")}
                    </span>
                  </div>
                </Link>

                <div className="relative group/avatar">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-400 p-[2px] shadow-md group-hover/avatar:shadow-xl transition-all duration-300 rotate-3 group-hover/avatar:rotate-0 cursor-pointer">
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-brand-700 font-bold text-lg overflow-hidden">
                      {user.fullName.charAt(0)}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={logout}
                  className="ml-2 p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100 shadow-sm active:scale-90"
                  title="Secure Sign Out"
                >
                  <svg className="w-5 h-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>

              {/* Mobile Interaction */}
              <div className="flex items-center sm:hidden gap-3">
                 <NotificationBell />
                 <button 
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-xl bg-gray-50 text-gray-600 border border-gray-100 shadow-sm active:scale-95 transition-transform"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {menuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`sm:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200 overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
             <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xl">
                {user.fullName.charAt(0)}
             </div>
             <div className="flex flex-col">
                <span className="font-black text-gray-900 uppercase tracking-tighter">{user.fullName}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.role}</span>
             </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-50 text-red-600 font-bold uppercase tracking-widest text-xs border border-red-100 active:scale-[0.98] transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
