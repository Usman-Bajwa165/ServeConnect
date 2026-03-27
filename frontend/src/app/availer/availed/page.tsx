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

  const handleMarkComplete = async (reqId: string) => {
    if (
      !confirm(
        "Are you sure you want to mark this task as completed? This represents an AvailRequest that this provider accepted.",
      )
    )
      return;
    setCompleteLoading(reqId);
    try {
      await axios.post(`/avail-requests/${reqId}/complete`);
      alert("Task marked as completed!");
      fetchApplications();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to complete task");
    } finally {
      setCompleteLoading(null);
    }
  };

  const openReviewModal = (provider: any) => {
    setReviewTarget(provider);
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
        rating,
        comment,
      });
      alert("Review posted successfully!");
      setReviewModalOpen(false);
      fetchApplications();
    } catch (err: any) {
      setReviewError(err.response?.data?.error || "Failed to submit review");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Availed Services
        </h1>
        <p className="mt-2 text-gray-600">
          These are properties and services you have applied for, and the
          provider has ACCEPTED your application.
        </p>
      </div>

      <AvailerNavTabs />

      {loading ? (
        <div className="flexjustify-center py-20">
          <div className="animate-pulse space-y-4 max-w-4xl mx-auto w-full">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 bg-white/50 border-gray-100 rounded-xl border-dashed border-2"
              ></div>
            ))}
          </div>
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
            No accepted services yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            When a provider accepts your application to their service, it will
            appear here so you can leave a review after completion.
          </p>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
          {applications.map((app) => (
            <Card
              key={app.id}
              className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row h-full">
                <div className="bg-gray-50 p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex justify-center items-center font-bold text-lg">
                      {app.service.provider.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-500 font-semibold tracking-wider">
                        Provider
                      </p>
                      <p className="font-bold text-gray-900 leading-tight">
                        {app.service.provider.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-center shadow-sm"
                      onClick={() => openReviewModal(app.service.provider)}
                    >
                      Leave Review
                    </Button>
                  </div>
                </div>

                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="success" className="mb-2">
                      Accepted
                    </Badge>
                    <span className="text-sm text-gray-500 font-medium">
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {app.service.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {app.service.description}
                  </p>

                  <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 -mx-2">
                    <p className="text-xs uppercase font-semibold text-blue-800 tracking-wider mb-2">
                      Your Application Note
                    </p>
                    <p className="text-blue-900 text-sm italic border-l-2 border-blue-300 pl-3 py-1">{`"${app.note}"`}</p>
                    <div className="w-full h-px bg-blue-100 my-3"></div>
                    <p className="text-xs font-semibold text-blue-800">
                      Provided Contact:{" "}
                      <span className="font-mono bg-white px-2 py-0.5 rounded shadow-sm inline-block ml-1">
                        {app.contactNumber}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

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
              <div className="w-10 h-10 rounded-full bg-brand-200 flex justify-center items-center font-bold text-brand-800">
                {reviewTarget.fullName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 leading-none">
                  Reviewing Provider
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {reviewTarget.fullName}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center py-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rating
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
                      className={`w-12 h-12 transition-colors ${star <= rating ? "text-yellow-400" : "text-gray-200 hover:text-yellow-200"}`}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 bg-white"
                rows={4}
                required
                placeholder="Share details of your experience with this provider..."
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
              <Button type="submit">Submit Review</Button>
            </div>
          </form>
        )}
      </Modal>
    </DashboardLayout>
  );
}
