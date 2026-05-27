import { useNavigate } from "react-router-dom";
import { type Participant } from "../data/Students";

interface CandidatesPageProps {
  students: Participant[];
}

export default function CandidatesPage({ students }: CandidatesPageProps) {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Candidates</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {students.map((s) => (
          <div
            key={s.uid}
            onClick={() => navigate(`/dashboard/candidates/${s.uid}`)}
            className="border rounded-xl bg-white p-4 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">
                {s.displayName ?? "Anonymous Participant"}
              </h3>

              <span className="text-sm text-gray-400">
                GPA —
              </span>
            </div>

            <p className="text-sm text-gray-500">
              {s.email}
            </p>

            <div className="mt-3 text-xs text-gray-600">
              {s.skillPassport.length}{" "}
              {s.skillPassport.length === 1 ? "skill area" : "skill areas"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}