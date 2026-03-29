import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AiSuggestionInput } from "@/components/ai/AiSuggestionInput";
import axios from "@/lib/axios";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetTitle: string;
  type: "service" | "avail-request";
  onSuccess: () => void;
}

import { startGlobalLoading, stopGlobalLoading } from "@/lib/events";

export const ApplyModal = ({
  isOpen,
  onClose,
  targetId,
  targetTitle,
  type,
  onSuccess,
}: ApplyModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFixingGrammar, setIsFixingGrammar] = useState(false);

  const [note, setNote] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    let formatted = "";

    if (digits.length > 0) {
      if (digits.length <= 3) formatted = digits;
      else formatted = `${digits.slice(0, 3)} ${digits.slice(3, 10)}`;
    }

    setContactNumber(formatted);
  };

  const handleNoteBlur = async () => {
    if (!note.trim()) return;
    setIsFixingGrammar(true);
    try {
      const res = await axios.post("/ai/suggest", {
        text: note,
        title: targetTitle,
      });
      if (res.data?.data?.suggestion) {
        setNote(res.data.data.suggestion);
      }
    } catch (err) {
      console.warn("AI refine failed");
    } finally {
      setIsFixingGrammar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    startGlobalLoading();
    setError("");

    const fullContact = `+92 ${contactNumber}`;

    if (!/^\+92 \d{3} \d{7}$/.test(fullContact)) {
      setError("Invalid contact format. Use 3XX XXXXXXX");
      setLoading(false);
      stopGlobalLoading();
      return;
    }

    try {
      const endpoint =
        type === "service"
          ? `/services/${targetId}/apply`
          : `/avail-requests/${targetId}/apply`;

      await axios.post(endpoint, {
        note,
        contactNumber: fullContact,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Failed to apply. Please try again.",
      );
    } finally {
      setLoading(false);
      stopGlobalLoading();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply to: ${targetTitle}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border-l-4 border-red-400">
            {error}
          </div>
        )}

        <div className="relative">
          <AiSuggestionInput
            label="Application Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={handleNoteBlur}
            placeholder="Briefly describe why you are a good fit..."
            required
          />
          {isFixingGrammar && (
            <div className="absolute top-0 right-0 mt-1 mr-2 flex items-center gap-1.5 text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100 animate-pulse">
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              AI is refining...
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number
          </label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-700 font-medium sm:text-sm">
              +92
            </span>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => formatPhoneNumber(e.target.value)}
              placeholder="3XX XXXXXXX"
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              required
              maxLength={11}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            AI refines your note automatically on exit.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};
