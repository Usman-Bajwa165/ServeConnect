import { useState, useRef, useEffect } from 'react';
import axios from '@/lib/axios';

interface UseAiSuggestionProps {
  type: 'description' | 'continuation';
  text: string;
  title?: string;
  enabled?: boolean;
}

export function useAiSuggestion({ type, text, title, enabled = true }: UseAiSuggestionProps) {
  const [suggestion, setSuggestion] = useState('');
  const [isInjecting, setIsInjecting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled || !text.trim()) {
      setSuggestion('');
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const fetchSuggestion = async () => {
      try {
        const res = await axios.post(
          '/ai/suggest',
          { type, text, title },
          { signal: abortControllerRef.current?.signal }
        );
        const newSuggestion = res.data?.data?.suggestion || '';
        
        // Prevent duplicate ghost text if user already typed it
        if (newSuggestion && !text.endsWith(newSuggestion)) {
          setSuggestion(newSuggestion);
        } else {
          setSuggestion('');
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          setSuggestion('');
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
    const result = `${text} ${suggestion}`.replace(/\s+/g, ' ');
    setSuggestion('');
    return result;
  };

  const clearSuggestion = () => setSuggestion('');

  return { suggestion, acceptSuggestion, clearSuggestion };
}
