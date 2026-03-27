"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AvailerNavTabs } from "@/components/layout/AvailerNavTabs";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import axios from "@/lib/axios";

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/avail-requests/my");
      setRequests(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await axios.delete(`/avail-requests/${id}`);
      fetchRequests();
    } catch (err) {
      alert("Failed to delete request");
    }
  };

  const handleMarkComplete = async (reqId: string) => {
    if (
      !confirm(
        "Marking this request as complete will finalize it and hide it from your active list. Proceed?",
      )
    )
      return;
    try {
      await axios.post(`/avail-requests/${reqId}/complete`);
      fetchRequests();
    } catch (err) {
      alert("Failed to mark complete");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            My Requests
          </h1>
          <p className="mt-2 text-gray-600">
            Tasks you have posted looking for a professional.
          </p>
        </div>
        <Link
          href="/availer/my-requests/new"
          className="bg-brand-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-brand-700 shadow-sm transition-all text-sm flex items-center gap-2 transform hover:-translate-y-0.5"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Post New Request
        </Link>
      </div>

      <AvailerNavTabs />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="animate-pulse bg-white/50 border-gray-100 h-64 border-dashed"
            />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 border-dashed animate-fade-in shadow-sm">
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <h3 className="text-xl font-bold text-gray-900">No requests yet</h3>
          <p className="mt-2 text-gray-500 mb-6 max-w-sm mx-auto">
            Post a job request so service providers can apply to assist you.
          </p>
          <Link
            href="/availer/my-requests/new"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-colors"
          >
            Create Request
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {requests.map((req) => (
            <Card
              key={req.id}
              className="border border-gray-200 h-full flex flex-col group hover:shadow-lg transition-all"
            >
              <div className="p-6 flex flex-col flex-1 relative">
                <div
                  className={`absolute inset-x-0 top-0 h-1 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity ${req.isReserved ? "bg-indigo-500" : "bg-brand-500"}`}
                ></div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1 flex-1">
                    {req.title}
                  </h3>
                </div>

                <div className="mb-4">
                  {req.isCompleted ? (
                    <Badge
                      variant="success"
                      className="font-semibold text-[10px] uppercase tracking-wider px-2 shadow-sm"
                    >
                      Completed
                    </Badge>
                  ) : req.isReserved ? (
                    <Badge
                      variant="info"
                      className="font-semibold text-[10px] uppercase tracking-wider px-2 shadow-sm text-indigo-700 bg-indigo-50 border-indigo-200"
                    >
                      Reserved / In Progress
                    </Badge>
                  ) : (
                    <Badge
                      variant="warning"
                      className="font-semibold text-[10px] uppercase tracking-wider px-2 shadow-sm"
                    >
                      Open for Applications
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 mb-6 line-clamp-3 text-sm flex-1 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100 italic">{`"${req.description}"`}</p>

                <div className="grid grid-cols-2 gap-3 mb-6 bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex flex-col items-center justify-center border-r border-gray-200">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Budget
                    </span>
                    <span className="font-bold text-gray-900">
                      Rs {Number(req.price).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Location
                    </span>
                    <span className="font-bold text-gray-900 flex items-center gap-1">
                      {req.location}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 flex items-center justify-between mt-auto">
                  {!req.isCompleted && req.isReserved ? (
                    <button
                      onClick={() => handleMarkComplete(req.id)}
                      className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
                    >
                      Mark Completed
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium tracking-wide">
                      Updated {new Date(req.updatedAt).toLocaleDateString()}
                    </span>
                  )}

                  {!req.isCompleted && (
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/availer/my-requests/${req.id}/applications`}
                        className="text-brand-600 bg-brand-50 hover:bg-brand-100 font-medium px-4 py-2 rounded-lg text-sm transition-colors border border-brand-100"
                      >
                        View Applicants
                      </Link>
                      <button
                        onClick={() => handleDelete(req.id, req.title)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors border border-red-100 focus:outline-none"
                        title="Delete Request"
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
