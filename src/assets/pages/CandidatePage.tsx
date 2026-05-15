import React, { useState } from "react";
import {
  GraduationCap,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
import { type Student } from "../data/Students";

function generateRadarData(student: Student) {
  return taxonomy.domains.map((domain) => {
    const score =
      student.stamps?.filter((stamp) =>
        domain.categories.some((cat) =>
          cat.stamps.includes(stamp)
        )
      ).length ?? 0;

    return {
      domain: domain.name.split(" ")[0],
      score: Math.min(score / 5, 1), // normalize 0–1
    };
  });
}

function GpaBadge({ gpa }: { gpa: number }) {
  const color =
    gpa >= 3.7
      ? "text-green-700 bg-green-50 border-green-200"
      : gpa >= 3.0
      ? "text-gray-700 bg-gray-50 border-gray-200"
      : "text-red-600 bg-red-50 border-red-200";

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${color}`}>
      {gpa.toFixed(1)}
    </span>
  );
}

function ExpandedCandidate({ student }: { student: Student }) {
  const radarData = generateRadarData(student);

  const topDomains = [...radarData]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((d) => d.domain);

  const stampCount = student.stamps?.length ?? 0;

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Radar */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-sm font-semibold mb-2">
          Holistic Profile
        </h3>

        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="domain" />
            <PolarRadiusAxis domain={[0, 1]} tick={false} axisLine={false} />
            <Radar
              dataKey="score"
              fill="#3b82f6"
              fillOpacity={0.5}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="space-y-4">
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">
            Top Strengths
          </h3>

          <div className="flex flex-wrap gap-2">
            {topDomains.map((d) => (
              <span
                key={d}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">
            Engagement
          </h3>

          <p className="text-sm text-gray-600">
            {stampCount} recorded experiences
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CandidatesPage({
  students,
}: {
  students: Student[];
}) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const accepted = students.filter(
    (s) => s.status === "Accepted"
  );

  const byProgram = accepted.reduce<Record<string, Student[]>>(
    (acc, s) => {
      (acc[s.program] ??= []).push(s);
      return acc;
    },
    {}
  );

  return (
    <div className="p-6 space-y-4">
      <p className="text-sm text-gray-500">
        {accepted.length} candidates across{" "}
        {Object.keys(byProgram).length} programs
      </p>

      {Object.keys(byProgram)
        .sort()
        .map((program) => (
          <div
            key={program}
            className="bg-white rounded-lg shadow"
          >
            <div className="px-6 py-4 border-b flex items-center gap-2 font-semibold">
              <GraduationCap size={18} />
              {program}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">
                    View
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {byProgram[program].map((student) => {
                  const isOpen =
                    expandedId === student.id;

                  return (
                    <React.Fragment key={student.id}>
                      <TableRow
                        onClick={() =>
                          setExpandedId((prev) =>
                            prev === student.id
                              ? null
                              : student.id
                          )
                        }
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>

                        <TableCell>
                          <GpaBadge gpa={student.gpa} />
                        </TableCell>

                        <TableCell className="text-sm text-gray-500">
                          {student.email}
                        </TableCell>

                        <TableCell className="text-right text-blue-600 text-sm">
                          {isOpen ? "Hide" : "View"}
                        </TableCell>
                      </TableRow>

                      {isOpen && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="bg-gray-50 p-6"
                          >
                            <ExpandedCandidate
                              student={student}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ))}
    </div>
  );
}