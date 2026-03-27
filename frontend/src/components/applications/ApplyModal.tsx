import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AiSuggestionInput } from '@/components/ai/AiSuggestionInput';
import axios from '@/lib/axios';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetTitle: string;
  type: 'service' | 'avail-request';
  onSuccess: () => void;
}

export const ApplyModal = ({ isOpen, onClose, targetId, targetTitle, type, onSuccess }: ApplyModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [note, setNote] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const formatPhoneNumber = (value: string) => {
    // Strip non-digits
    const digits = value.replace(/\D/g, '');
    let formatted = '';
    
    // Pakistani format: +92 3XX XXXXXXX
    // The user types: 3123456789
    // Store in state as just the digits (max 10), pad with the prefix
    
    if (digits.length > 0) {
      if (digits.length <= 3) formatted = digits;
      else formatted = `${digits.slice(0, 3)} ${digits.slice(3, 10)}`;
    }
    
    setContactNumber(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const fullContact = `+92 ${contactNumber}`;
    
    if (!/^\+92 \d{3} \d{7}$/.test(fullContact)) {
      setError('Invalid contact format. Use 3XX XXXXXXX');
      setLoading(false);
      return;
    }

    try {
      const endpoint = type === 'service' 
        ? `/services/${targetId}/apply` 
        : `/avail-requests/${targetId}/apply`;
        
      await axios.post(endpoint, {
        note,
        contactNumber: fullContact
      });
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to apply. Please try again.');
    } finally {
      setLoading(false);
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

        <AiSuggestionInput
          label="Application Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          contextType="continuation"
          placeholder="Briefly describe why you are a good fit..."
          required
        />

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
              maxLength={11} // 10 digits + 1 space
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Press tab while typing the note to autocomplete with AI.</p>
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
