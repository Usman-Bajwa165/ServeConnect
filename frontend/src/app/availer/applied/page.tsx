"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AvailerNavTabs } from "@/components/layout/AvailerNavTabs";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import axios from "@/lib/axios";

export default function AvailerAppliedPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("/applications/applied");
      setApplications(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <DashboardLayout
      title="Applied Services"
      subtitle="Track services you've applied to. Once accepted, they'll move to Availed Services."
    >
      <AvailerNavTabs />

      {loading ? (
        <div className="space-y-4 max-w-4xl mx-auto">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-32 bg-white/50 border-gray-100 rounded-xl border-dashed border-2 animate-pulse"
            ></div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border-dashed border-2 border-gray-200 max-w-4xl mx-auto">
          <svg
            className="mx-auto h-16 w-16 text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No active applications
          </h3>
          <p className="text-gray-500">
            You haven&apos;t applied to any services yet. Visit the dashboard to
            find professionals.
          </p>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
          {applications.map((app) => {
            const isService = !!app.service;
            const item = isService ? app.service : app.availRequest;

            return (
              <Card
                key={app.id}
                className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="flex flex-col md:flex-row h-full">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        variant="warning"
                        className="bg-yellow-50 text-yellow-700 border-yellow-100 px-3 uppercase tracking-wider text-[10px] font-bold"
                      >
                        Pending Approval
                      </Badge>
                      <span className="text-xs text-gray-400 font-medium">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 italic">{`"${app.note}"`}</p>

                    <div className="flex items-center gap-4 text-sm font-medium text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold">
                          {(isService
                            ? item.provider.fullName
                            : item.availer.fullName
                          ).charAt(0)}
                        </div>
                        <span>
                          {isService
                            ? item.provider.fullName
                            : item.availer.fullName}
                        </span>
                      </div>
                      <div className="w-px h-4 bg-gray-300"></div>
                      <span>₨ {Number(item.price).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
