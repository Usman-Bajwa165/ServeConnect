"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/reviews/StarRating";
import { ApplyModal } from "@/components/applications/ApplyModal";
import axios from "@/lib/axios";

export default function ProviderProfilePage() {
  const { id } = useParams();
  const router = useRouter();

  const [provider, setProvider] = useState<any>(null);
  const [activeService, setActiveService] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`/users/${id}`);
      setProvider(res.data.data);
    } catch (err) {
      router.push("/availer/dashboard");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.sub);
      } catch (e) {}
    }
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!provider) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium transition-colors"
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
          Back to Directory
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-10 animate-fade-in relative">
        <div className="h-32 bg-gradient-to-r from-brand-600 to-accent-500 opacity-90 absolute w-full top-0 left-0"></div>
        <div className="px-8 pb-8 pt-24 relative z-10">
          <div className="flex flex-col sm:flex-row gap-6 items-end sm:items-center">
            <div className="w-24 h-24 rounded-2xl bg-white flex flex-shrink-0 items-center justify-center text-4xl font-bold text-gray-800 border-4 border-white shadow-xl -mt-12 backdrop-blur-md">
              {provider.fullName.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-1">
                {provider.fullName}
              </h1>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-600 mb-2">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-gray-400"
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
                  {provider.city}
                </span>
                •
                <span className="text-brand-600">
                  Joined {new Date(provider.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="items-center gap-4 bg-gray-50 rounded-lg py-2 px-4 border border-gray-100 mt-4 inline-flex shadow-inner">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                    Reputation
                  </span>
                  <StarRating rating={provider.averageRating} />
                </div>
                <div className="w-px h-8 bg-gray-300 mx-2"></div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                    Services
                  </span>
                  <span className="font-bold text-gray-800">
                    {provider.providerServices.length} listed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-sm flex items-start justify-between animate-slide-up">
          <p className="text-green-800 font-medium">{successMsg}</p>
          <button
            onClick={() => setSuccessMsg("")}
            className="text-green-600 hover:text-green-800 focus:outline-none"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8 animate-slide-up delay-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              <svg
                className="w-6 h-6 text-brand-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Offered Services
            </h2>
            {provider.providerServices.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
                <p className="text-gray-500">
                  This provider has no public services listed yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {provider.providerServices.map((service: any) => {
                  const hasApplied = service.applications?.some(
                    (app: any) => app.applicantId === currentUserId,
                  );
                  return (
                    <Card
                      key={service.id}
                      className="hover:border-brand-300 transition-colors border border-gray-200"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {service.title}
                            </h3>
                            <p className="text-gray-600 mb-4 whitespace-pre-wrap leading-relaxed">
                              {service.description}
                            </p>
                            <div className="flex flex-wrap gap-2 text-sm font-medium">
                              <Badge
                                variant="success"
                                className="bg-green-100 text-green-800 px-3 py-1 font-semibold rounded-lg shadow-sm"
                              >
                                ₨ {Number(service.price).toLocaleString()}
                              </Badge>
                              <Badge className="bg-gray-100 text-gray-700 px-3 py-1 font-medium rounded-lg flex items-center gap-1 border-gray-200">
                                <svg
                                  className="w-3.5 h-3.5"
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
                              </Badge>
                            </div>
                          </div>
                          {hasApplied ? (
                            <button
                              disabled
                              className="bg-gray-400 text-white font-medium px-6 py-2.5 rounded-lg w-full sm:w-auto text-center cursor-not-allowed"
                            >
                              Applied
                            </button>
                          ) : (
                            <button
                              onClick={() => setActiveService(service)}
                              className="bg-brand-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-brand-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap active:bg-brand-800 focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 w-full sm:w-auto text-center"
                            >
                              Apply Now
                            </button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="animate-slide-up delay-200">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-accent-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Recent Reviews ({provider.reviewsReceived.length})
            </h2>

            {provider.reviewsReceived.length === 0 ? (
              <p className="text-gray-500 text-sm italic text-center py-6 bg-gray-50 rounded-lg">
                No reviews yet.
              </p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {provider.reviewsReceived.map((rev: any) => (
                  <div
                    key={rev.id}
                    className="pb-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 p-3 -mx-3 rounded-lg transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                          {rev.author.fullName.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">
                          {rev.author.fullName}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mb-2 bg-yellow-50 inline-flex px-2 py-0.5 rounded-md border border-yellow-100">
                      <StarRating rating={rev.rating} />
                    </div>
                    <p className="text-gray-600 text-sm italic">{`"${rev.comment}"`}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {activeService && (
        <ApplyModal
          isOpen={true}
          onClose={() => setActiveService(null)}
          targetId={activeService.id}
          targetTitle={activeService.title}
          type="service"
          onSuccess={() => {
            setSuccessMsg(
              `Successfully applied for "${activeService.title}". You will be notified via the Availed tab when accepted.`,
            );
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </DashboardLayout>
  );
}
