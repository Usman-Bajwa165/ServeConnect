"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AvailerNavTabs } from "@/components/layout/AvailerNavTabs";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/reviews/StarRating";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

export default function AvailerProfilePage() {
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
    <DashboardLayout title="My Profile" subtitle="Completed jobs & reviews given">
      <div className="w-full flex flex-col">
        <AvailerNavTabs />
        <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-10">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-400 flex items-center justify-center text-white font-black text-2xl shadow-md">
              {user?.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user?.fullName}</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Service Availer</p>
            </div>
            {data && (
              <div className="ml-auto flex gap-6 text-center">
                <div>
                  <p className="text-2xl font-black text-brand-600">{data.completedRequests.length}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-brand-600">{data.reviewsGiven.length}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reviews Given</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-brand-600">{(data.reviewsReceived || []).length}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reviews Received</p>
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
              {/* Completed Requests */}
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                  Completed Services ({data.completedRequests.length})
                </h3>
                {data.completedRequests.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
                    No completed services yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.completedRequests.map((r: any) => (
                      <Card key={r.id} className="border-gray-100 shadow-sm">
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900">{r.title}</h4>
                            <Badge variant="success" className="text-[10px] font-bold uppercase tracking-wider">
                              Completed
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{r.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {r.location}
                            </span>
                            <span className="font-black text-brand-600">Rs {Number(r.price).toLocaleString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Reviews Given */}
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                  Reviews Given ({data.reviewsGiven.length})
                </h3>
                {data.reviewsGiven.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
                    You haven't reviewed any providers yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.reviewsGiven.map((r: any) => (
                      <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center font-bold text-sm">
                              {r.target.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-0.5">Provider</p>
                              <p className="font-bold text-gray-900 text-sm">{r.target.fullName}</p>
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

              {/* Reviews Received */}
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                  Reviews Received ({(data.reviewsReceived || []).length})
                </h3>
                {(data.reviewsReceived || []).length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
                    No reviews received yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.reviewsReceived.map((r: any) => (
                      <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                              {r.author.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-0.5">Provider</p>
                              <p className="font-bold text-gray-900 text-sm">{r.author.fullName}</p>
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
