import { useNavigate } from "react-router-dom";
import { type Participant } from "../data/Students";
import { type ParticipantPassportSummary } from "../../api/client";

interface CandidatesPageProps {
  students: Participant[];
  passportByUid?: Record<string, ParticipantPassportSummary>;
}

export default function CandidatesPage({ students }: CandidatesPageProps) {
  const navigate = useNavigate();

  return (
    <div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {students.map((s) => (
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