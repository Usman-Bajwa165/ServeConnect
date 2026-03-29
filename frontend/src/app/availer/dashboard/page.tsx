"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AvailerNavTabs } from "@/components/layout/AvailerNavTabs";
import { SearchBar } from "@/components/search/SearchBar";
import { CityFilter } from "@/components/search/CityFilter";
import { Card, CardContent } from "@/components/ui/Card";
import { StarRating } from "@/components/reviews/StarRating";
import { Badge } from "@/components/ui/Badge";
import { ApplyModal } from "@/components/applications/ApplyModal";
import axios from "@/lib/axios";
import { useDebounce } from "@/hooks/useDebounce";

export default function AvailerDashboard() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [activeService, setActiveService] = useState<any>(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [servicesRes, appliedRes, statsRes] = await Promise.all([
        axios.get("/services", { params: { search: debouncedSearch, city, limit: 50 } }),
        axios.get("/applications/my-service-apps"),
        axios.get("/users/me/stats"),
      ]);

      const allServices: any[] = servicesRes.data.data.data;
      const applied: any[] = appliedRes.data.data;

      // Map serviceId -> application status for all apps this user submitted
      const appStatusMap = new Map<string, string>();
      applied.forEach((a: any) => {
        if (a.serviceId) appStatusMap.set(a.serviceId, a.status);
      });

      // Only hide services where user has a PENDING application (already applied, awaiting response)
      // Accepted/rejected services stay visible — accepted ones show "Availed" badge
      setServices(
        allServices
          .filter((s: any) => appStatusMap.get(s.id) !== "PENDING")
          .map((s: any) => ({ ...s, _appStatus: appStatusMap.get(s.id) || null }))
      );
      setStats(statsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, city]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardLayout
      title="Browse Services"
      subtitle="Find the perfect professional for your needs."
    >
      <div className="w-full h-full p-6 lg:p-10">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Active Requests", val: stats?.activeRequests ?? "...", icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" /> },
            { label: "Pending Apps", val: stats?.pendingApps ?? "...", icon: <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
            { label: "Completed Tasks", val: stats?.completedTasks ?? "...", icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{stat.icon}</svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900 leading-none">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>

        <AvailerNavTabs />

        {/* Search + Filter */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search services by title or description..." />
          </div>
          <div className="w-full sm:w-64">
            <CityFilter value={city} onChange={setCity} />
          </div>
          {(search || city) && (
            <button
              onClick={() => { setSearch(""); setCity(""); }}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse bg-white/50 border-gray-100 h-64 border-dashed" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 border-dashed">
            <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">No services found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or city filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
            {services.map((service) => (
              <Card key={service.id} className="h-full flex flex-col border-gray-200 shadow-sm hover:shadow-lg transition-all group">
                <CardContent className="flex flex-col flex-1 p-6">
                  {/* Service info */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-brand-500 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1 mb-1">
                    {service.title}
                  </h3>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 italic flex-1">
                    "{service.description}"
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="success" className="bg-green-50 text-green-700 border-green-100 font-bold">
                      Rs {Number(service.price).toLocaleString()}
                    </Badge>
                    <Badge className="bg-gray-50 text-gray-600 border-gray-100 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {service.location}
                    </Badge>
                  </div>

                  {/* Provider info */}
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-100 to-accent-100 flex items-center justify-center text-brand-700 font-bold text-sm border border-white shadow-sm flex-shrink-0">
                        {service.provider.fullName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{service.provider.fullName}</p>
                        <p className="text-xs text-gray-400">{service.provider.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <StarRating rating={service.provider.averageRating} />
                      <Link
                        href={`/availer/provider/${service.provider.id}`}
                        className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Provider
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Apply button */}
                  {service._appStatus === "ACCEPTED" ? (
                    <div className="w-full py-2.5 bg-green-50 border border-green-200 text-green-700 font-semibold rounded-lg text-sm text-center">
                      ✓ Availed
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveService(service)}
                      className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow-md active:scale-[0.98] text-sm"
                    >
                      Apply Now
                    </button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {activeService && (
        <ApplyModal
          isOpen={true}
          onClose={() => setActiveService(null)}
          targetId={activeService.id}
          targetTitle={activeService.title}
          type="service"
          onSuccess={() => {
            setActiveService(null);
            fetchData();
          }}
        />
      )}
    </DashboardLayout>
  );
}
