// src/hooks/useStampCounts.ts
import { useEffect, useState } from "react";
import { getParticipantStamps, type StampInstance } from "../api/client";

export interface StampCounts {
  stampCount: number;
  interactionCount: number;
  loading: boolean;
  error: string | null;
}

  // Module-level cache so repeated mounts (table re-render, modal reopen, etc.)
  // don't refetch the same participant's stamps.
  const cache = new Map<string, StampInstance[]>();
  const inFlight = new Map<string, Promise<StampInstance[]>>();
 
  // Simple concurrency limiter so we don't fire 100 requests at once.
  const MAX_CONCURRENT = 5;
  let activeCount = 0;
  const queue: Array<() => void> = [];
 
  function runNext() {
    if (activeCount >= MAX_CONCURRENT || queue.length === 0) return;
    activeCount++;
    const next = queue.shift()!;
    next();
  }
 
  function schedule<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      queue.push(() => {
        task()
          .then(resolve, reject)
          .finally(() => {
            activeCount--;
            runNext();
          });
      });
      runNext();
    });
  }

  function fetchStampsCached(token: string, participantId: string): Promise<StampInstance[]> {
    const cached = cache.get(participantId);
    if (cached) return Promise.resolve(cached);
 
    const pending = inFlight.get(participantId);
    if (pending) return pending;
 
    const promise = schedule(() => getParticipantStamps(token, participantId)).then((stamps) => {
      cache.set(participantId, stamps);
      inFlight.delete(participantId);
      return stamps;
    }).catch((err) => {
      inFlight.delete(participantId);
      throw err;
    });
 
    inFlight.set(participantId, promise);
    return promise;
  }

export function useStampCounts(token: string | null, participantId: string): StampCounts {
  const [stampCount, setStampCount] = useState(0);
  const [interactionCount, setInteractionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

  fetchStampsCached(token, participantId)
      .then((stamps) => {
        if (cancelled) return;
        setStampCount(stamps.length);
        setInteractionCount(stamps.reduce((sum, s) => sum + s.timesUnlocked, 0));
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load stamps");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, participantId]);

  return { stampCount, interactionCount, loading, error };
}