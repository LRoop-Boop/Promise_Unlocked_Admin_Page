import { useState, useEffect, useMemo } from 'react';
import { getPvaCatalog, type ApiPva } from '../../api/client';

export function usePvaCatalog(token: string | null) {
  const [pvas, setPvas] = useState<ApiPva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setPvas([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchCatalog() {
      setLoading(true);
      setError(null);
      try {
        const result = await getPvaCatalog(token!);
        if (!cancelled) setPvas(result);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load PVA catalog');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCatalog();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const pvaNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const pva of pvas) map.set(pva.id, pva.name);
    return map;
  }, [pvas]);

  return { pvaNameById, loading, error };
}