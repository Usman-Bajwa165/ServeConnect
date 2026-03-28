"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProviderNavTabs } from "@/components/layout/ProviderNavTabs";
import { Card, CardContent } from "@/components/ui/Card";
import { StarRating } from "@/components/reviews/StarRating";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

export default function ProviderProfilePage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/users/me/full-profile")
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="My Profile" subtitle="Your services & reviews">
      <div className="w-full flex flex-col">
        <ProviderNavTabs />
        <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-10">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-400 flex items-center justify-center text-white font-black text-2xl shadow-md">
              {user?.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user?.fullName}</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Service Provider</p>
              {data && (
                <div className="mt-2">
                  <StarRating rating={data.averageRating} />
                </div>
              )}
            </div>
            {data && (
              <div className="ml-auto flex gap-6 text-center">
                <div>
                  <p className="text-2xl font-black text-brand-600">{data.services.length}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Services</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-brand-600">{data.reviews.length}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reviews</p>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-white rounded-xl border border-dashed border-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Services Section */}
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                  All Services ({data.services.length})
                </h3>
                {data.services.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
                    No services posted yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.services.map((s: any) => (
                      <Card key={s.id} className="border-gray-100 shadow-sm">
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900">{s.title}</h4>
                            <span className="text-sm font-black text-brand-600">Rs {Number(s.price).toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{s.description}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                            <svg className="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {s.location}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                  Reviews Received ({data.reviews.length})
                </h3>
                {data.reviews.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
                    No reviews yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.reviews.map((r: any) => (
                      <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                              {r.author.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{r.author.fullName}</p>
                              {r.author.city && (
                                <p className="text-[10px] text-gray-400 font-medium">{r.author.city}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <StarRating rating={r.rating} />
                            <span className="text-[10px] text-gray-400">
                              {new Date(r.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                          "{r.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
