import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  getParticipantSessions,
  getSessionDetail,
  type AdminSessionSummary,
  type SessionInteraction,
} from "../../api/client";

export default function ChatLogPanel({
  token,
  participantId,
}: {
  token: string;
  participantId: string;
}) {
  const [sessions, setSessions] = useState<AdminSessionSummary[]>([]);
  const [transcripts, setTranscripts] = useState<Record<string, SessionInteraction[]>>({});
  const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const sessionList = await getParticipantSessions(token, participantId);
        if (cancelled) return;

        setSessions(sessionList);

        const details = await Promise.all(
          sessionList.map((s) => getSessionDetail(token, s.sessionId))
        );
        if (cancelled) return;

        const byId: Record<string, SessionInteraction[]> = {};
        sessionList.forEach((s, idx) => {
          byId[s.sessionId] = details[idx].interactions;
        });

        setTranscripts(byId);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load chat logs");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, participantId]);

  const toggleSession = (sessionId: string) => {
    setExpandedSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }));
  };

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Loading chat logs…</div>;
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">{error}</div>;
  }

  if (sessions.length === 0) {
    return <p className="p-4 text-sm text-gray-400">No sessions yet.</p>;
  }

  return (
    <div className="space-y-6">
      {sessions
        .sort(
          (a, b) =>
            new Date(b.startedAt).getTime() -
            new Date(a.startedAt).getTime()
        )
        .map((s) => (
          <div
            key={s.sessionId}
            className="border rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleSession(s.sessionId)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-2">
                {expandedSessions[s.sessionId] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}

                <div className="text-left">
                  <p className="text-sm font-medium">
                    {new Date(s.startedAt).toLocaleDateString()}
                  </p>

                  <p className="text-xs text-gray-500">
                    {s.totalInteractions} interactions
                  </p>

                  <p className="text-[10px] text-gray-400 font-mono">
                    {s.sessionId}
                  </p>
                </div>
              </div>

              <span className="text-xs text-gray-500">
                {new Date(s.startedAt).toLocaleTimeString()}
              </span>
            </button>

            {expandedSessions[s.sessionId] && (
              <div className="divide-y">
                {(transcripts[s.sessionId] ?? [])
                  .sort((a, b) => a.sequenceIndex - b.sequenceIndex)
                  .map((i) => (
                    <div
                      key={i.id}
                      className={`px-4 py-3 space-y-2 border-l-4 ${
                        i.isWeakFit
                          ? "bg-amber-50 border-amber-300"
                          : "bg-blue-50 border-blue-300"
                      }`}
                    >
                      <p className="text-xs text-gray-400">
                        #{i.sequenceIndex} ·{" "}
                        {new Date(i.timestamp).toLocaleString()}
                        {i.isWeakFit && (
                          <span className="ml-2 font-medium text-amber-700">
                            Unmapped / Weak Fit
                          </span>
                        )}
                      </p>

                      <p className="text-sm">
                        <span className="font-semibold">Q:</span>{" "}
                        {i.question}
                      </p>

                      <p className="text-sm">
                        <span className="font-semibold">A:</span>{" "}
                        {i.answer}
                      </p>
                    </div>
                  ))}

                {(transcripts[s.sessionId] ?? []).length === 0 && (
                  <p className="px-4 py-4 text-sm text-gray-400">
                    No interactions recorded.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}