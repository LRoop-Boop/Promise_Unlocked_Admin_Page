import { BarChart3 } from "lucide-react";
import {
  ApplicationsByProgramChart,
  StatusBreakdownChart,
  GpaDistributionChart,
} from "../components/ReportsCharts";
import { type Student } from "../data/Students";

interface ReportsPageProps {
  students: Student[];
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${accent}`}>
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

export default function ReportsPage({ students }: ReportsPageProps) {
  const totalProfiles = students.length;

  const avgGpa =
    totalProfiles > 0
      ? (
          students.reduce((sum, s) => sum + s.gpa, 0) / totalProfiles
        ).toFixed(2)
      : "0.00";

  const programCounts = students.reduce((acc, s) => {
    const key = s.program ?? "Undeclared";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topProgram =
    Object.entries(programCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "N/A";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 size={24} className="text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-800">
          Profile Reports
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Total Profiles"
          value={totalProfiles}
          accent="border-l-blue-500"
        />

        <StatCard
          label="Average GPA"
          value={avgGpa}
          accent="border-l-purple-500"
        />

        <StatCard
          label="Top Program"
          value={topProgram}
          accent="border-l-yellow-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ApplicationsByProgramChart students={students} />
        <StatusBreakdownChart students={students} />
      </div>

      <GpaDistributionChart students={students} />
    </div>
  );
}