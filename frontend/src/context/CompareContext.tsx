import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Product } from '@/components/products/ProductCard';

const MAX_COMPARE = 3;

interface CompareState {
  items: Product[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  isFull: boolean;
}

const CompareContext = createContext<CompareState | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const add = useCallback((p: Product) => {
    setItems((prev) => (prev.length >= MAX_COMPARE || prev.some((x) => x.id === p.id) ? prev : [...prev, p]));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const has = useCallback((id: string) => items.some((x) => x.id === id), [items]);

  return (
    <CompareContext.Provider value={{ items, add, remove, clear, has, isFull: items.length >= MAX_COMPARE }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
