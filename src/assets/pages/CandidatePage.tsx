import { useNavigate } from "react-router-dom";
import { type Student } from "../data/Students";

interface CandidatesPageProps {
  students: Student[];
}

export default function CandidatesPage({ students }: CandidatesPageProps) {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Candidates</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {students.map((s) => (
          <div
            key={s.id}
            onClick={() => navigate(`/dashboard/candidates/${s.id}`)}
            className="border rounded-xl bg-white p-4 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">{s.name}</h3>
              <span className="text-sm text-gray-600">
                GPA {s.gpa.toFixed(1)}
              </span>
            </div>

            <p className="text-sm text-gray-500">{s.program}</p>

            <div className="mt-3 text-xs text-gray-600">
              {s.stamps.length} experiences
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}