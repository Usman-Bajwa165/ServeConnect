"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/reviews/StarRating";
import axios from "@/lib/axios";

export default function ServiceApplicationsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [service, setService] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await axios.get("/services/my");
      const svc = res.data.data.find((r: any) => r.id === id);
      setService(svc);

      if (svc) {
        const appRes = await axios.get(`/services/${id}/applications`);
        setApplications(appRes.data.data);
      } else {
        router.push("/provider/services");
      }
    } catch (err) {
      router.push("/provider/services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAccept = async (applicationId: string) => {
    if (
      !confirm(
        "Are you sure you want to accept this request? The client will be notified.",
      )
    )
      return;

    setAcceptingId(applicationId);
    try {
      await axios.post(`/services/${id}/applications/${applicationId}/accept`);
      router.push("/provider/services");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to accept application");
      setAcceptingId(null);
    }
  };

  if (!service && loading) {
    return (
      <DashboardLayout>
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <button
          onClick={() => router.back()}
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
          Back to My Services
        </button>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Review Applicants
        </h1>
        <p className="mt-2 text-gray-600">
          Review clients who want to hire you for {`"${service?.title}"`}.
        </p>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4 max-w-4xl">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-40 bg-white/50 border-dashed rounded-xl"
            ></div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm max-w-4xl animate-fade-in">
          <svg
            className="mx-auto h-12 w-12 text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">
            No applicants yet
          </h3>
          <p className="mt-1 text-gray-500">
            Wait for clients to request this service.
          </p>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl animate-slide-up">
          {applications.map((app) => (
            <Card
              key={app.id}
              className="border border-brand-100 shadow-sm overflow-visible relative"
            >
              {app.status === "PENDING" && (
                <div className="absolute -left-3 top-8 w-6 h-6 bg-brand-500 rounded-full border-4 border-gray-50 shadow-sm z-10 hidden md:block"></div>
              )}
              <CardContent className="p-6 md:pl-8 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-lg shadow-sm">
                        {app.applicant.fullName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {app.applicant.fullName}
                        </h3>
                        <div className="mt-0.5">
                          <StarRating rating={app.applicant.averageRating} />
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {app.status}
                    </span>
                  </div>

                  <div className="bg-gray-50/80 p-4 rounded-lg border border-gray-100 mb-4 whitespace-pre-wrap italic text-sm text-gray-700 relative">
                    <svg
                      className="absolute top-2 left-2 w-6 h-6 text-gray-200"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <span className="relative z-10 pl-6 block">
                      {`"${app.note}"`}
                    </span>
                  </div>

                  <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {app.contactNumber}
                  </div>
                </div>

                <div className="flex flex-col justify-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                  {app.status === "PENDING" ? (
                    <Button
                      onClick={() => handleAccept(app.id)}
                      isLoading={acceptingId === app.id}
                      variant="primary"
                      className="w-full bg-brand-600 hover:bg-brand-700 shadow-md transform hover:-translate-y-0.5 transition-all"
                    >
                      Accept Client
                    </Button>
                  ) : (
                    <Button
                      disabled
                      variant="outline"
                      className="w-full border-green-200 bg-green-50 text-green-700"
                    >
                      {app.status === "ACCEPTED" ? "Accepted" : "Unavailable"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
