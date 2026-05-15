import { useParams, useNavigate } from "react-router-dom";
import { type Student } from "../data/Students";
import { Button } from "@/components/ui/button";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import taxonomy from "../data/Taxonomy";

function generateRadarData(student: Student) {
  return taxonomy.domains.map((domain) => {
    const score =
      student.stamps?.filter((stamp) =>
        domain.categories.some((cat) => cat.stamps.includes(stamp.name))
      ).length ?? 0;

    return {
      domain: domain.name.split(" ")[0],
      score: Math.min(score / 5, 1),
    };
  });
}

export default function CandidateProfilePage({
  students,
}: {
  students: Student[];
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const student = students.find((s) => s.id === Number(id));

  if (!student) {
    return <div className="p-6">Student not found</div>;
  }

  const radarData = generateRadarData(student);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <div>
          <h1 className="text-2xl font-bold">{student.name}</h1>
          <p className="text-sm text-gray-500">{student.program}</p>
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
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="domain" />
              <PolarRadiusAxis domain={[0, 1]} tick={false} />
              <Radar dataKey="score" fill="#3b82f6" fillOpacity={0.5} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* QUICK STATS */}
        <div className="bg-white p-4 rounded-lg shadow space-y-3">
          <h2 className="font-semibold">Snapshot</h2>

          <div className="text-sm text-gray-600">
            GPA: <span className="font-medium">{student.gpa}</span>
          </div>

          <div className="text-sm text-gray-600">
            Stamps: <span className="font-medium">{student.stamps.length}</span>
          </div>

          <div className="text-sm text-gray-600">
            Email: {student.email}
          </div>
        </div>
      </div>

      {/* STAMPS SECTION (expand later) */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-4">Passport Stamps</h2>

        <div className="grid grid-cols-6 gap-3">
          {student.stamps.map((s) => (
            <div
              key={s.id}
              className="border rounded p-2 text-xs text-center"
            >
              {s.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}