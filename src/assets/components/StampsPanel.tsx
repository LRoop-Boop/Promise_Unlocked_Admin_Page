import { useEffect, useState } from "react";
import {
  getParticipantStamps,
  getStampEvidence,
  getPvaCatalog,
  type ApiPva,
  type StampInstance,
  type StampEvidenceInteraction,
} from "../../api/client";

export default function StampsPanel({
  token,
  participantId,
  selectedPvaId,
}: {
  token: string;
  participantId: string;
  selectedPvaId: string | null;
}) {
  const [stamps, setStamps] = useState<StampInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<StampInstance | null>(null);
  const [evidence, setEvidence] = useState<StampEvidenceInteraction[] | null>(null);
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [pvas, setPvas] = useState<ApiPva[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getParticipantStamps(token, participantId)
      .then((data) => !cancelled && setStamps(data))
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [token, participantId]);

  useEffect(() => {
    let cancelled = false;

    getPvaCatalog(token)
        .then((data) => {
        if (!cancelled) {
            setPvas(data);
        }
        })
        .catch(console.error);

    return () => {
        cancelled = true;
    };
    }, [token]);

  const openEvidence = async (stamp: StampInstance) => {
    setSelected(stamp);
    setEvidence(null);
    setEvidenceLoading(true);
    try {
      const data = await getStampEvidence(token, participantId, stamp.sessionId, stamp.stampName);
      setEvidence(data.interactions);
    } catch (e) {
      setEvidence([]);
    } finally {
      setEvidenceLoading(false);
    }
  };

  if (loading) return <div className="p-4 text-sm text-gray-500">Loading stamps…</div>;
  if (error) return <div className="p-4 text-sm text-red-500">{error}</div>;

  const distinctCategories = new Set(stamps.map((s) => s.category)).size;
  const totalUnlocks = stamps.reduce((sum, s) => sum + s.timesUnlocked, 0);

  const selectedPvaName =
    pvas.find((p) => p.id === selectedPvaId)?.name ?? "None";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border p-4 text-center">
          <p className="text-xs text-gray-400">Total Stamps Unlocked</p>
          <p className="text-2xl font-bold text-blue-600">{stamps.length}</p>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <p className="text-xs text-gray-400">Regions Mapped</p>
          <p className="text-2xl font-bold text-blue-600">{distinctCategories}</p>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <p className="text-xs text-gray-400">Total Interactions Mapped</p>
          <p className="text-2xl font-bold text-blue-600">{totalUnlocks}</p>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <p className="text-xs text-gray-400">Selected PVA</p>
          <p className="text-2xl font-bold text-blue-600">{selectedPvaName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-4">
        {stamps.map((s) => (
            <button
            key={`${s.stampName}-${s.sessionId}`}
            onClick={() => openEvidence(s)}
            className="border rounded-xl p-4 text-left hover:border-blue-400 hover:shadow transition bg-white"
            >
            <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                {s.stampName}
            </h3>

            <p className="text-xs text-gray-500 mb-3">
                {s.category}
            </p>

            <div className="space-y-1 text-xs text-gray-500">
                <p>Tier {s.tier}</p>
                <p>{s.timesUnlocked} unlock{s.timesUnlocked !== 1 ? "s" : ""}</p>
                <p>
                {new Date(s.firstUnlockedAt).toLocaleDateString()}
                </p>
            </div>
            </button>
        ))}

        {stamps.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-400">
            No stamps earned yet.
            </div>
        )}
        </div>

      {selected && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelected(null)} />
          <div className="fixed inset-0 z-50 flex items-start justify-center p-6 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
              <div className="border-b px-6 py-4">
                <h3 className="text-lg font-bold">{selected.stampName}</h3>
                <p className="text-sm text-gray-500">{selected.category} · Tier {selected.tier}</p>
              </div>
              <div className="p-6 space-y-4">
                {evidenceLoading && <p className="text-sm text-gray-500">Loading evidence…</p>}
                {!evidenceLoading && evidence?.length === 0 && (
                  <p className="text-sm text-gray-400">No linked interactions found.</p>
                )}
                {evidence && evidence.length > 0 && (
                    <div>
                        <h4 className="font-semibold mb-3">
                        Why this stamp was awarded
                        </h4>

                        <ul className="list-disc pl-6 space-y-3">
                        {evidence.map((i) => (
                            <li key={i.id}>
                            <p className="text-sm text-gray-800">
                                {i.justification}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                {new Date(i.timestamp).toLocaleDateString()}
                            </p>
                            </li>
                        ))}
                        </ul>
                    </div>
                    )}
              </div>
              <div className="border-t px-6 py-4 flex justify-end">
                <button onClick={() => setSelected(null)} className="text-sm px-4 py-2 border rounded hover:bg-gray-50">
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}