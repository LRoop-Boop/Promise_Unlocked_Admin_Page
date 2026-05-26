import { useParams, useNavigate } from "react-router-dom";
import { type Participant } from "../data/Students";
import { Button } from "@/components/ui/button";
import RadarProfileChart from "../components/RadarChart";
import { ResponsiveContainer } from "recharts";


export default function CandidateProfilePage({
  students,
}: {
  students: Participant[];
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const student = students.find((s) => s.uid === id);

  if (!student) {
    return <div className="p-6">Student not found</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <div>
          <h1 className="text-2xl font-bold">
            {student.displayName ?? "Anonymous Participant"}
          </h1>

          <p className="text-sm text-gray-500">{student.email}</p>
        </div>

        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-6">
        {/* RADAR */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Holistic Profile</h2>

          <ResponsiveContainer width="100%" height={300}>
            <RadarProfileChart student={student} />
          </ResponsiveContainer>
        </div>

        {/* QUICK STATS */}
        <div className="bg-white p-4 rounded-lg shadow space-y-3">
          <h2 className="font-semibold">Traditional Info</h2>

          <div className="text-sm text-gray-600">
            GPA:{" "}
            <span className="font-medium text-gray-400">—</span>
          </div>

          <div className="text-sm text-gray-600">
            Skill Areas:{" "}
            <span className="font-medium">
              {student.skillPassport.length}
            </span>
          </div>

          <div className="text-sm text-gray-600">
            Email: {student.email}
          </div>

          <div className="text-sm text-gray-600">
            Joined:{" "}
            {new Date(student.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* PASSPORT SECTION */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-4">Passport Categories</h2>

        <div className="grid grid-cols-6 gap-3">
          {student.skillPassport.map((s) => (
            <div
              key={s.category}
              className="border rounded p-2 text-xs text-center"
            >
              {s.category}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}