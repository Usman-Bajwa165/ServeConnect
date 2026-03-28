"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ProviderNavTabs } from "@/components/layout/ProviderNavTabs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import axios from "@/lib/axios";

export default function PendingJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<any>(null); // { id, fullName, applicationId }
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");

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

  useEffect(() => { fetchJobs(); }, []);

  const openReviewModal = (client: any, applicationId: string) => {
    setReviewTarget({ ...client, applicationId });
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
      fetchJobs();
    } catch (err: any) {
      setReviewError(err.response?.data?.error || "Failed to submit review");
    }
  };

  return (
    <DashboardLayout
      title="Pending Jobs"
      subtitle="Provider Dashboard • Tracking your active work."
    >
      <div className="w-full h-full p-0 flex flex-col">
        <ProviderNavTabs />
        <div className="p-6 lg:p-10 flex-1">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-pulse space-y-4 max-w-4xl mx-auto w-full">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-40 bg-white/50 border-gray-100 rounded-xl border-dashed border-2"></div>
                ))}
              </div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border-dashed border-2 border-gray-200 shadow-sm animate-fade-in max-w-4xl mx-auto">
              <svg className="mx-auto h-16 w-16 text-brand-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No pending jobs found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Once your applications or incoming service requests are accepted, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto animate-slide-up">
              {jobs.map((job) => {
                const isAvailRequest = !!job.availRequestId;
                const item = isAvailRequest ? job.availRequest : job.service;
                const client = isAvailRequest ? job.availRequest.availer : job.applicant;
                const isCompleted = job.isCompleted;

                return (
                  <Card key={job.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="bg-accent-50/50 p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-accent-100 flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-accent-100 text-accent-700 flex justify-center items-center font-bold text-2xl shadow-inner border-2 border-white group-hover:scale-110 transition-transform">
                          {client?.fullName?.charAt(0) || "?"}
                        </div>
                        <p className="text-[10px] uppercase text-accent-700 font-black tracking-widest mb-1 mt-3">Client</p>
                        <p className="font-bold text-gray-900 text-lg leading-tight">{client?.fullName || "Valued Customer"}</p>
                        <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-2">
                          <svg className="w-4 h-4 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {client?.city || "Local Area"}
                        </p>

                        {isCompleted && (
                          <div className="mt-4 w-full">
                            {job.reviewGiven ? (
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
                                onClick={() => openReviewModal(client, job.id)}
                              >
                                Post Review
                              </Button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="p-6 md:w-2/3 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex gap-2">
                            <Badge
                              variant={isCompleted ? "success" : "warning"}
                              className={`px-3 uppercase tracking-tighter text-[9px] font-black ${isCompleted ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-100"}`}
                            >
                              {isCompleted ? "Completed" : "In Progress"}
                            </Badge>
                            <Badge variant="gray" className="px-3 uppercase tracking-tighter text-[9px] font-black border-gray-200 text-gray-400">
                              {isAvailRequest ? "Custom Job" : "Standard Service"}
                            </Badge>
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {new Date(job.updatedAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">
                          {item?.title || "Project in Progress"}
                        </h3>

                        <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-inner flex-1">
                          <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest mb-2 opacity-60">Contract Note</p>
                          <p className="text-gray-700 text-sm italic leading-relaxed bg-gray-50/50 p-3 rounded border border-gray-50">
                            {`"${job.note || "No specific instructions provided."}"`}
                          </p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-brand-50 rounded-md">
                              <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <span className="font-mono text-sm font-bold text-gray-900">{job.contactNumber}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Budget</p>
                            <p className="font-black text-lg text-brand-600">₨ {Number(item?.price || 0).toLocaleString()}</p>
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
      </div>

      <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Write a Review">
        {reviewTarget && (
          <form onSubmit={submitReview} className="space-y-6 pt-2">
            {reviewError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border-l-4 border-red-400">{reviewError}</div>
            )}
            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent-200 flex justify-center items-center font-black text-accent-800 border-2 border-white shadow-sm">
                {reviewTarget.fullName.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1 tracking-widest">Reviewing Client</p>
                <p className="text-lg font-black text-gray-900 tracking-tight">{reviewTarget.fullName}</p>
              </div>
            </div>

            <div className="flex flex-col items-center py-4">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Star Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none rounded-full transform transition-transform hover:scale-110 active:scale-95">
                    <svg className={`w-12 h-12 transition-colors ${star <= rating ? "text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.3)]" : "text-gray-100 hover:text-yellow-200"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Your Feedback</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white shadow-sm font-medium text-gray-800"
                rows={4}
                required
                placeholder="How was working with this client?"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button type="button" variant="ghost" onClick={() => setReviewModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="font-bold">Submit Review</Button>
            </div>
          </form>
        )}
      </Modal>
    </DashboardLayout>
  );
}
