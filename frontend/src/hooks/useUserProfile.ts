import { useState, useEffect, useCallback } from 'react';
import { getSessionId } from '@/lib/session';

const PROFILE_KEY = 'smartmoney_profile';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface UserProfile {
  session_id: string;
  nationality: string;
  residency_status: string;
  monthly_salary_aed: number | null;
  employer_category: string | null;
  preferred_language: string;
  transfer_frequency: string | null;
  preferred_speed: string | null;
  onboarded: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  session_id: '',
  nationality: 'IN',
  residency_status: 'resident',
  monthly_salary_aed: null,
  employer_category: null,
  preferred_language: 'en',
  transfer_frequency: null,
  preferred_speed: null,
  onboarded: false,
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  // Load profile from localStorage on mount
  useEffect(() => {
    const sessionId = getSessionId();
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProfile({ ...parsed, session_id: sessionId });
      } catch {
        setProfile({ ...DEFAULT_PROFILE, session_id: sessionId });
      }
    } else {
      setProfile({ ...DEFAULT_PROFILE, session_id: sessionId });
    }
    setLoading(false);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    const sessionId = getSessionId();
    const newProfile = { ...profile, ...updates, session_id: sessionId };
    setProfile(newProfile);

    // Persist to localStorage
    localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));

    // Sync to backend
    try {
      await fetch(`${API_BASE}/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile),
      });
    } catch {
      // Silently fail — localStorage is the primary store
    }
  }, [profile]);

  return { profile, updateProfile, loading };
}
