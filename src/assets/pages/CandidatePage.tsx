import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { type Participant } from "../data/Students";
import { type ParticipantPassportSummary } from "../../api/client";

interface CandidatesPageProps {
  students: Participant[];
  passportByUid?: Record<string, ParticipantPassportSummary>;
}

export default function CandidatesPage({ students }: CandidatesPageProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const sorted = [...students].sort((a, b) =>
    (a.displayName ?? a.email ?? "").localeCompare(b.displayName ?? b.email ?? "")
  );

  const filtered = sorted.filter((s) => {
    const query = search.toLowerCase();
    const name = (s.displayName ?? "").toLowerCase();
    const email = (s.email ?? "").toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <span className="text-sm text-gray-500">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div
            key={s.uid}
            onClick={() => navigate(`/dashboard/candidates/${s.uid}`)}
            className="rounded-xl bg-white shadow p-4 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">
                {s.displayName ?? "Anonymous Participant"}
              </h3>
            </div>

            <p className="text-sm text-gray-500">
              {s.email}
            </p>

          </div>
        ))}
      </div>
    </div>
  );
}