"use client";

import React, { useEffect, useState } from "react";

export const LoadingBar = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    window.addEventListener('start-loading', handleStart);
    window.addEventListener('stop-loading', handleStop);

    return () => {
      window.removeEventListener('start-loading', handleStart);
      window.removeEventListener('stop-loading', handleStop);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent">
      <div className="h-full bg-brand-600 animate-loading-bar shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
    </div>
  );
};
