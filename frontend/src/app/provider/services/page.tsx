"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProviderNavTabs } from "@/components/layout/ProviderNavTabs";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import axios from "@/lib/axios";

export default function MyServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await axios.get("/services/my");
      setServices(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await axios.delete(`/services/${id}`);
      fetchServices();
    } catch (err) {
      alert("Failed to delete service");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            My Services
          </h1>
          <p className="mt-2 text-gray-600">
            Manage the services you offer to others.
          </p>
        </div>
        <Link
          href="/provider/services/new"
          className="bg-brand-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-brand-700 shadow-sm transition-all focus:ring-2 focus:ring-offset-2 flex items-center gap-2 transform hover:-translate-y-0.5"
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
          Add New Service
        </Link>
      </div>

      <ProviderNavTabs />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="animate-pulse bg-white/50 border-gray-100 h-64 border-dashed"
            />
          ))}
        </div>
      ) : services.length === 0 ? (
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
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-xl font-bold text-gray-900">No services yet</h3>
          <p className="mt-2 text-gray-500 mb-6 max-w-sm mx-auto">
            Get started by creating your first service listing so availers can
            find you.
          </p>
          <Link
            href="/provider/services/new"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-colors"
          >
            Create Service
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {services.map((service) => (
            <Card
              key={service.id}
              className="h-full flex flex-col group border-gray-200 shadow-sm hover:shadow-lg transition-all"
            >
              <CardContent className="flex flex-col flex-1 p-6 relative">
                <div className="absolute inset-x-0 top-0 h-1 bg-brand-500 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                    {service.title}
                  </h3>
                </div>

                <p className="text-gray-600 mb-6 line-clamp-3 text-sm flex-1 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100 italic">{`"${service.description}"`}</p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col items-center justify-center">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Price
                    </span>
                    <span className="font-bold text-gray-900">
                      Rs {Number(service.price).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col items-center justify-center">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Location
                    </span>
                    <span className="font-bold text-gray-900 flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5 text-brand-500"
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
                      {service.location}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 flex items-center justify-between mt-auto">
                  <span className="text-xs text-gray-400 font-medium tracking-wide">
                    Updated {new Date(service.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/provider/services/${service.id}/applications`}
                      className="text-brand-600 bg-brand-50 hover:bg-brand-100 font-medium px-4 py-2 rounded-lg text-sm transition-colors border border-brand-100"
                    >
                      View Applicants
                    </Link>
                    <button
                      onClick={() => handleDelete(service.id, service.title)}
                      className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors border border-red-100 flex items-center justify-center h-[38px] w-[38px]"
                      title="Delete Service"
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
