import { BarChart3 } from "lucide-react";
import {
  ApplicationsByProgramChart,
  StatusBreakdownChart,
  GpaDistributionChart,
} from "../components/ReportsCharts";
import { students } from "../data/Students"

const totalApplicants = students.length;

const acceptedCount = students.filter((s) => s.status === "Accepted").length;
const rejectedCount = students.filter((s) => s.status === "Rejected").length;
const decidedApplicants = acceptedCount + rejectedCount;

const acceptanceRate = decidedApplicants > 0
  ? Math.round((acceptedCount / decidedApplicants) * 100)
  : 0;

const avgGpa = (
  students.reduce((sum, s) => sum + s.gpa, 0) / totalApplicants
).toFixed(2);

const mostPopularProgram = Object.entries(
  students.reduce((acc, s) => {
    acc[s.program] = (acc[s.program] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>)
).sort((a, b) => b[1] - a[1])[0][0];

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

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">

      <div className="flex items-center gap-2">
        <BarChart3 size={24} className="text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-800">Reports</h1>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Applicants"   value={totalApplicants}      accent="border-l-blue-500"   />
        <StatCard label="Acceptance Rate"    value={`${acceptanceRate}%`} accent="border-l-green-500"  />
        <StatCard label="Average GPA"        value={avgGpa}               accent="border-l-purple-500" />
        <StatCard label="Top Program"        value={mostPopularProgram}   accent="border-l-yellow-400" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ApplicationsByProgramChart />
        <StatusBreakdownChart />
      </div>

      <GpaDistributionChart />

    </div>
  );
}