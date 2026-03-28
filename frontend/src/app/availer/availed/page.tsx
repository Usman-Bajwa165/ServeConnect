"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AvailerNavTabs } from "@/components/layout/AvailerNavTabs";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import axios from "@/lib/axios";

export default function AvailedServicesPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [completeLoading, setCompleteLoading] = useState<string | null>(null);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");

  const fetchApplications = async () => {
    try {
      const res = await axios.get("/applications/availed");
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

  const handleMarkComplete = async (appId: string) => {
    if (
      !confirm(
        "Are you sure you want to mark this task as completed? This will allow you to leave a review for the professional.",
      )
    )
      return;
    setCompleteLoading(appId);
    try {
      await axios.patch(`/applications/${appId}/complete`);
      fetchApplications();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to complete task");
    } finally {
      setCompleteLoading(null);
    }
  };

  const openReviewModal = (provider: any, applicationId: string) => {
    setReviewTarget({ ...provider, applicationId });
    setRating(5);
    setComment("");
    setReviewError("");
    setReviewModalOpen(true);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");

    try {
      await axios.post("/reviews", {
        targetId: reviewTarget.id,
        applicationId: reviewTarget.applicationId,
        rating,
        comment,
      });
      setReviewModalOpen(false);
      fetchApplications();
    } catch (err: any) {
      setReviewError(err.response?.data?.error || "Failed to submit review");
    }
  };

  return (
    <DashboardLayout
      title="Availed Services"
      subtitle="Track your active and completed collaborations."
    >
      <AvailerNavTabs />

      <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full">
        {loading ? (
          <div className="space-y-4 w-full">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 bg-white/50 border-gray-100 rounded-xl border-dashed border-2 animate-pulse"
              ></div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border-dashed border-2 border-gray-200">
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
              No active collaborations
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Once a service application is accepted, or you accept a provider
              for your request, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {applications.map((app) => {
              const isService = !!app.service;
              const item = isService ? app.service : app.availRequest;
              const provider = isService ? item.provider : app.applicant;
              const isCompleted = app.isCompleted;

              return (
                <Card
                  key={app.id}
                  className={`border border-gray-100 shadow-sm hover:shadow-md transition-all ${isCompleted ? "opacity-90 grayscale-[0.2]" : ""}`}
                >
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="bg-gray-50 p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex justify-center items-center font-bold text-lg border-2 border-white shadow-sm">
                          {provider.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest leading-none mb-1">
                            Professional
                          </p>
                          <p className="font-bold text-gray-900 leading-tight">
                            {provider.fullName}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 mt-auto">
                        {isCompleted ? (
                          app.reviewGiven ? (
                            <div className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-xs font-black uppercase tracking-widest">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              Reviewed
                            </div>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              className="w-full justify-center shadow-sm"
                              onClick={() => openReviewModal(provider, app.id)}
                            >
                              Post Review
                            </Button>
                          )
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-center text-xs font-black text-green-600 hover:bg-green-50 uppercase tracking-widest"
                            isLoading={completeLoading === app.id}
                            onClick={() => handleMarkComplete(app.id)}
                          >
                            Mark Completed
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="p-6 md:w-2/3 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-2">
                          <Badge
                            variant={isCompleted ? "success" : "info"}
                            className={`px-3 py-0.5 rounded-full uppercase tracking-tighter text-[9px] font-black ${isCompleted ? "bg-green-100 text-green-700" : "bg-brand-100 text-brand-700"}`}
                          >
                            {isCompleted ? "Completed" : "Active / Accepted"}
                          </Badge>
                          <Badge
                            variant="gray"
                            className="px-3 py-0.5 rounded-full uppercase tracking-tighter text-[9px] font-black border-gray-200 text-gray-400"
                          >
                            {isService ? "Service" : "Custom Job"}
                          </Badge>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-gray-900 mb-1 tracking-tight">
                        {item.title}
                      </h3>

                      <div className="mt-4 bg-white rounded-xl p-4 border border-gray-100 shadow-inner flex-1">
                        <p className="text-[10px] uppercase font-black text-brand-600 tracking-widest mb-2 opacity-60">
                          Notes & Contact
                        </p>
                        <p className="text-gray-700 text-sm italic mb-4 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                          {`"${app.note}"`}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-brand-50 rounded-md">
                              <svg
                                className="w-4 h-4 text-brand-600"
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
                            </div>
                            <span className="font-mono text-sm font-bold text-gray-900">
                              {app.contactNumber}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">
                              Price
                            </p>
                            <p className="font-black text-lg text-brand-600">
                              ₨ {Number(item.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Write a Review"
      >
        {reviewTarget && (
          <form onSubmit={submitReview} className="space-y-6 pt-2">
            {reviewError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4 border-l-4 border-red-400">
                {reviewError}
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-full bg-brand-200 flex justify-center items-center font-black text-brand-800 border-2 border-white shadow-sm">
                {reviewTarget.fullName.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1 tracking-widest">
                  Reviewing Professional
                </p>
                <p className="text-lg font-black text-gray-900 tracking-tight">
                  {reviewTarget.fullName}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center py-4">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-4">
                Star Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-full transform transition-transform hover:scale-110 active:scale-95"
                  >
                    <svg
                      className={`w-12 h-12 transition-colors ${star <= rating ? "text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.3)]" : "text-gray-100 hover:text-yellow-200"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                Your Feedback
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white shadow-sm font-medium text-gray-800"
                rows={4}
                required
                placeholder="How was the service? Your review helps the community."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setReviewModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="font-bold">
                Submit Review
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </DashboardLayout>
  );
}
