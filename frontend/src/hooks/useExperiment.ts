import { useState, useEffect } from 'react';
import { getSessionId } from '@/lib/session';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

/**
 * Hook for A/B experiment assignment.
 * Returns the assigned variant for the current session.
 * Caches assignment in localStorage for consistency.
 */
export function useExperiment(experimentName: string): string | null {
  const [variant, setVariant] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    // Check localStorage cache first
    const cacheKey = `ab_${experimentName}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setVariant(cached);
      return;
    }

    fetch(`${API_BASE}/api/experiments/assign?session_id=${sessionId}&experiment=${experimentName}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.variant) {
          setVariant(data.variant);
          localStorage.setItem(cacheKey, data.variant);
        }
      })
      .catch(() => {});
  }, [experimentName]);

  return variant;
}
