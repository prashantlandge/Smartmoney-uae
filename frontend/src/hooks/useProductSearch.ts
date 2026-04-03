import { useState, useEffect, useRef } from 'react';
import type { Product } from '@/components/products/ProductCard';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export function useProductSearch(query: string, debounceMs = 300) {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const abortRef = useRef<AbortController>();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Debounce
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      // Cancel previous request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      fetch(
        `${API_BASE}/api/products/search?q=${encodeURIComponent(query)}&limit=8`,
        { signal: controller.signal }
      )
        .then((r) => {
          if (!r.ok) throw new Error(`API ${r.status}`);
          return r.json();
        })
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setResults([]);
            setLoading(false);
          }
        });
    }, debounceMs);

    return () => {
      clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
  }, [query, debounceMs]);

  return { results, loading };
}
