import { X, Mail, Phone, MapPin, Calendar, Award, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useNavigate } from "react-router-dom";

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
import { type Student, type Status, type PassportStamp } from "../data/Students";

function generateRadarData(student: Student) {
  return taxonomy.domains.map((domain) => {
    const score =
      student.stamps?.filter((stamp) =>
        domain.categories.some((cat) =>
          cat.stamps.includes(stamp.name)
        )
      ).length ?? 0;

    return {
      domain: domain.name.split(" ")[0],
      score: Math.min(score / 5, 1),
    };
  });
}

function StatusBadge({ status }: { status: Status }) {
  const variants: Record<Status, string> = {
    Accepted: "bg-green-100 text-green-800 border-green-200",
    "In Review": "bg-yellow-100 text-yellow-800 border-yellow-200",
    Pending: "bg-gray-100 text-gray-700 border-gray-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-sm border ${variants[status]}`}>
      {status}
    </span>
  );
}

function StampBadge({ stamp }: { stamp: PassportStamp }) {
  const colors = {
    Technical: "bg-blue-100 text-blue-700 border-blue-300",
    Leadership: "bg-purple-100 text-purple-700 border-purple-300",
    Communication: "bg-green-100 text-green-700 border-green-300",
    Research: "bg-orange-100 text-orange-700 border-orange-300",
    Community: "bg-pink-100 text-pink-700 border-pink-300",
  };

  return (
    <div
      className={`p-3 rounded-lg border text-center ${colors[stamp.category]}`}
      title={stamp.description}
    >
      <Award size={28} />
      <div className="text-xs mt-2 font-semibold">{stamp.name}</div>
    </div>
  );
}

export default function StudentDetailModal({
  student,
  onClose,
}: {
  student: Student;
  onClose: () => void;
}) {
  const radarData = generateRadarData(student);
  const navigate = useNavigate();

  const topDomains = [...radarData]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((d) => d.domain);

  const stampCount = student.stamps?.length ?? 0;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex justify-between">
            <div>
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <p className="text-sm text-gray-600">{student.program}</p>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={student.status} />
              <button onClick={onClose}>
                <X />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-8">

            <div className="grid grid-cols-2 gap-6">

              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Holistic Profile</h3>

                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="domain" />
                    <PolarRadiusAxis domain={[0, 1]} tick={false} />
                    <Radar dataKey="score" fill="#3b82f6" fillOpacity={0.5} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">

                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Top Strengths</h3>
                  <div className="flex flex-wrap gap-2">
                    {topDomains.map((d) => (
                      <span key={d} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Engagement</h3>
                  <p className="text-sm text-gray-600">
                    {stampCount} recorded experiences
                  </p>
                </div>

              </div>
            </div>
            <section className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div><Mail /> {student.email}</div>
              <div><Phone /> {student.phone}</div>
              <div><MapPin /> {student.address}</div>
              <div><Calendar /> {student.birthDate}</div>
              <div><GraduationCap /> {student.expectedGraduation}</div>
              <div><Award /> GPA: {student.gpa.toFixed(2)}</div>
            </section>

            <section>
              <h3 className="font-semibold mb-3">
                Passport Stamps ({stampCount})
              </h3>

              {stampCount === 0 ? (
                <div className="text-gray-500 bg-gray-50 p-6 rounded">
                  No stamps earned yet.
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-4">
                  {student.stamps.map((s) => (
                    <StampBadge key={s.id} stamp={s} />
                  ))}
                </div>
              )}
            </section>

            {stampCount > 0 && (
              <section>
                <h3 className="font-semibold mb-3">Evidence</h3>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Stamp</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Evidence</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {student.stamps.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.category}</TableCell>
                        <TableCell>
                          {new Date(s.earnedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {s.evidence}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </section>
            )}

          </div>
          <div className="border-t p-4 flex justify-between items-center bg-gray-50">
            <Button variant="outline" onClick={() => { onClose(); navigate(`/dashboard/candidates/${student.id}`); }}>
              View Profile
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button>Download</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}