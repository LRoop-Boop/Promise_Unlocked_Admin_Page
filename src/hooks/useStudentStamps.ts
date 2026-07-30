import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getParticipantStamps, type StampInstance } from '../api/client'; // adjust to wherever it lives

export function useStudentStamps(participantId: string | undefined) {
  const { token } = useAuth();
  const [stamps, setStamps] = useState<StampInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !participantId) return;
    let cancelled = false;

    setLoading(true);
    setError(null);
    getParticipantStamps(token, participantId)
      .then((data) => {
        if (!cancelled) setStamps(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load stamps');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, participantId]);

  return { stamps, loading, error };
}