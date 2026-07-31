import { useState, useEffect, useMemo } from 'react';
import { getParticipantsPage } from '../../api/client';

export interface PassportCategoryMapping {
  sessionId: string;
  interactionId: string;
  justification: string;
  timestamp: number;
}

export interface SkillPassport {
  category: string;
  level: number;
  firstMappedAt: number;
  lastMappedAt: number;
  totalMappings: number;
  mappings: PassportCategoryMapping[];
}

export interface Participant {
  // Identity
  uid: string;
  email: string | null;
  displayName: string | null;
  fullName: string | null;
  photoURL: string | null;

  // Demographics
  gender: string | null;
  ethnicity: string | null;
  dateOfBirth: string | null;

  // Contact
  phone: string | null;
    address: {
    street: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
  } | null;

  // School
  schoolName: string | null;
  schoolAddress: string | null;

  // Metadata
  metadata: {
    bio: string | null;
    pageUrl: string | null;
  };

  // PromiseUnlocked
  selectedPvaId: string | null;

  // Dates
  createdAt: number;
  updatedAt: number;
  lastActiveAt: number;

  // Passport
  skillPassport: SkillPassport[];
}

const PAGE_SIZE = 100;

export function useParticipants(token: string | null) {
  const [pages, setPages] = useState<Participant[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setPages([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchAllPages() {
      setLoading(true);
      setError(null);
      const collected: Participant[][] = [];

      try {
        let page = 1;
        while (true) {
          const result = await getParticipantsPage(token!, page, PAGE_SIZE);
           
          if (cancelled) return;

          collected.push(result.participants);

          if (result.participants.length < PAGE_SIZE) break;
          page += 1;
        }
        if (!cancelled) setPages(collected);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load participants');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAllPages();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const participants = useMemo(() => {
    const seen = new Set<string>();
    const merged: Participant[] = [];
    for (const pageItems of pages) {
      for (const p of pageItems) {
        if (!seen.has(p.uid)) {
          seen.add(p.uid);
          merged.push(p);
        }
      }
    }
    return merged;
  }, [pages]);

  return { participants, loading, error };
}