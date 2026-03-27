"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import axios from "@/lib/axios";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/avail-requests", {
        params: { search: "" },
      });
      setRequests(res.data.data.data);
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
    if (
      !confirm(
        `ADMIN ACTION: Are you sure you want to forcibly delete the request "${title}"?`,
      )
    )
      return;
    try {
      await axios.delete(`/admin/avail-requests/${id}`);
      fetchRequests();
    } catch (err) {
      alert("Failed to delete request");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <Link
          href="/admin/dashboard"
          className="text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium transition-colors mb-4"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Avail Requests Moderation
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="animate-pulse bg-white/50 h-40 border-dashed"
            />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 text-gray-500">
          No requests listed currently.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {requests.map((req) => (
            <Card key={req.id}>
              <CardContent className="p-6 flex flex-col h-full relative">
                <span className="absolute top-4 right-4 text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  Rs {req.price}
                </span>
                <h3 className="font-bold text-lg text-gray-900 mb-1 pr-16">
                  {req.title}
                </h3>

                <div className="mb-2">
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
                      className="font-semibold text-[10px] uppercase tracking-wider px-2 shadow-sm"
                    >
                      Reserved
                    </Badge>
                  ) : (
                    <Badge
                      variant="warning"
                      className="font-semibold text-[10px] uppercase tracking-wider px-2 shadow-sm"
                    >
                      Open
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2 italic">{`"${req.description}"`}</p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">
                      {req.availer.fullName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {req.availer.fullName}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(req.id, req.title)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
                  >
                    Force Delete
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
