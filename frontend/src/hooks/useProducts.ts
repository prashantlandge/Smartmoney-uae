import { useState, useEffect } from 'react';
import type { Product } from '@/components/products/ProductCard';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

interface ProfileParams {
  salary?: number | null;
  nationality?: string;
  residency?: string;
  employer?: string | null;
  transfer_frequency?: string | null;
}

export function useProducts(category: string, profile?: ProfileParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (profile?.salary) params.set('salary', String(profile.salary));
    if (profile?.nationality) params.set('nationality', profile.nationality);
    if (profile?.residency) params.set('residency', profile.residency);
    if (profile?.employer) params.set('employer', profile.employer);
    if (profile?.transfer_frequency) params.set('transfer_frequency', profile.transfer_frequency);

    const qs = params.toString();
    const url = `${API_BASE}/api/products/list/${category}${qs ? `?${qs}` : ''}`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`API ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [category, profile?.salary, profile?.nationality, profile?.residency, profile?.employer, profile?.transfer_frequency]);

  return { products, loading, error };
}
