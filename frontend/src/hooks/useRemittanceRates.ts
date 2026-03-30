import { useState, useEffect, useRef } from 'react';
import { compareRemittanceRates, RemittanceCompareResponse } from '@/lib/api';

export function useRemittanceRates(sendAmount: number, debounceMs: number = 500) {
  const [data, setData] = useState<RemittanceCompareResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Clear previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Don't fetch for invalid amounts
    if (!sendAmount || sendAmount <= 0) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    timerRef.current = setTimeout(async () => {
      // Cancel previous request
      if (abortRef.current) {
        abortRef.current.abort();
      }
      abortRef.current = new AbortController();

      try {
        const result = await compareRemittanceRates(sendAmount);
        setData(result);
        setError(null);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError('Unable to fetch rates. Please try again.');
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [sendAmount, debounceMs]);

  return { data, loading, error };
}
