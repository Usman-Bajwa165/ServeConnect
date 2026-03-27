"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProviderNavTabs } from "@/components/layout/ProviderNavTabs";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import axios from "@/lib/axios";

export default function PendingJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/applications/pending-jobs");
      setJobs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Pending Jobs
          </h1>
          <p className="mt-2 text-gray-600">
            Tasks assigned to you that are not yet marked as completed.
          </p>
        </div>
      </div>

      <ProviderNavTabs />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-pulse space-y-4 max-w-4xl mx-auto w-full">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 bg-white/50 border-gray-100 rounded-xl border-dashed border-2"
              ></div>
            ))}
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border-dashed border-2 border-gray-200 shadow-sm animate-fade-in">
          <svg
            className="mx-auto h-16 w-16 text-brand-300 mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No pending jobs found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            When your applications are accepted, they will appear here until the
            job is completed.
          </p>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto animate-slide-up">
          {jobs.map((job) => {
            // Determine if this is a requested job (Flow A) or a service application (Flow B)
            const isAvailRequest = !!job.availRequestId;
            const targetData = isAvailRequest ? job.availRequest : job.service;
            const clientData = isAvailRequest ? job.availRequest.availer : null; // For services, the user who applied isn't easily accessible without adding it to the API response or modifying the schema. Actually, for a service, the applicant IS the availer. But here we are the provider viewing our pending jobs. If we applied to a request, the availer is the request owner. If an availer applied to our service, the availer is the applicant.

            // Note: The API currently returns applications where applicantId = providerId. This means it only includes Flow A (provider applied to an avail request).
            // Let's assume the jobs list here corresponds to Flow A based on the API logic.

            return (
              <Card
                key={job.id}
                className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex flex-col md:flex-row h-full">
                  <div className="bg-accent-50/50 p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-accent-100 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-accent-100 text-accent-700 flex justify-center items-center font-bold text-2xl shadow-inner border border-accent-200 mb-4 group-hover:scale-110 transition-transform">
                      {targetData?.availer?.fullName?.charAt(0) || "?"}
                    </div>
                    <p className="text-xs uppercase text-accent-700 font-bold tracking-wider mb-1">
                      Client
                    </p>
                    <p className="font-bold text-gray-900 text-lg">
                      {targetData?.availer?.fullName || "Unknown Client"}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {targetData?.availer?.city || "Unknown Location"}
                    </p>
                  </div>

                  <div className="p-6 md:w-2/3 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <Badge
                        variant="warning"
                        className="mb-2 shadow-sm font-semibold uppercase tracking-wider text-[10px] px-2 py-1"
                      >
                        In Progress
                      </Badge>
                      <span className="text-sm text-gray-500 font-medium">
                        Accepted {new Date(job.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {targetData?.title || "Unknown Task"}
                    </h3>
                    <p className="text-gray-600 text-sm flex-1 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100 italic">{`"${targetData?.description || "No description provided"}"`}</p>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex gap-2 text-sm font-medium">
                        <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded shadow-sm border border-brand-100">
                          Job ID: {targetData?.id?.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        Waiting for client to mark complete
                      </div>
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
