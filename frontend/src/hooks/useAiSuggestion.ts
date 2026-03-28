import { useState, useRef, useEffect } from 'react';
import axiosInstance from '@/lib/axios';
import { isCancel } from 'axios';

interface UseAiSuggestionProps {
  type: 'description' | 'continuation' | 'grammar';
  text: string;
  title?: string;
  enabled?: boolean;
}

export function useAiSuggestion({ type, text, title, enabled = true }: UseAiSuggestionProps) {
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled || (type !== 'description' && !text.trim())) {
      setSuggestion('');
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const fetchSuggestion = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.post(
          '/ai/suggest',
          { type, text, title },
          { signal: abortControllerRef.current?.signal }
        );
        const newSuggestion = (res.data?.data?.suggestion || '').trim();
        
        // Prevent duplicate ghost text if user already typed it
        if (newSuggestion && !text.trim().endsWith(newSuggestion)) {
          setSuggestion(newSuggestion);
        } else {
          setSuggestion('');
        }
      } catch (err) {
        if (!isCancel(err)) {
          setSuggestion('');
        }
      } finally {
        // Only set loading false if this was the latest request
        if (!abortControllerRef.current?.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchSuggestion();

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [text, type, title, enabled]);

  const acceptSuggestion = () => {
    if (!suggestion) return text;
    // Ensure we don't add redundant words if user keeps typing
    const result = `${text.trim()} ${suggestion}`.replace(/\s+/g, ' ');
    setSuggestion('');
    return result;
  };

  const clearSuggestion = () => setSuggestion('');

  return { suggestion, acceptSuggestion, clearSuggestion, isLoading };
}
