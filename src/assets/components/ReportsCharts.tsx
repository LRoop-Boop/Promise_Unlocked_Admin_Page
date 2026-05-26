import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { type Participant } from "../data/Students";
import SKILLS_TAXONOMY from "../data/Taxonomy";
import { scoreStudentDomains } from "../components/ScoreStudentDomains";

interface ChartProps {
  students: Participant[];
}

export function ApplicationsByProgramChart({ students }: ChartProps) {
  const domains = Object.keys(SKILLS_TAXONOMY);

  const domainCounts: Record<string, number> = Object.fromEntries(
    domains.map((d) => [d, 0])
  );

  students.forEach((student) => {
    const scores = scoreStudentDomains(student);

    scores.forEach(({ domain, score }) => {
      domainCounts[domain] += score;
    });
  });

  const chartData = domains.map((domain) => ({
    domain,
    count: domainCounts[domain] ?? 0,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Top Participant Domains
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          <XAxis
            dataKey="domain"
            interval={0}
            tick={{ fontSize: 10 }}
            angle={-30}
            textAnchor="end"
            height={80}
          />

          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />

          <Bar dataKey="count" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Participant Type Breakdown
// ---------------------------------------------------------------------------

export function StatusBreakdownChart({ students }: ChartProps) {
  const registered = students.filter((s) => !s.isAnonymous).length;
  const anonymous = students.length - registered;

  const statusCounts = [
    { name: "Registered", value: registered },
    { name: "Anonymous", value: anonymous },
  ];

  const COLORS: Record<string, string> = {
    Registered: "#22c55e",
    Anonymous: "#94a3b8",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Participant Type
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={statusCounts}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
          >
            {statusCounts.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skill Passport Distribution
// ---------------------------------------------------------------------------

export function GpaDistributionChart({ students }: ChartProps) {
  const safeStudents = students ?? [];

  const counts = safeStudents.map((s) => s?.skillPassport?.length ?? 0);

  const buckets = [
    { range: "1–2", min: 1, max: 2 },
    { range: "3–4", min: 3, max: 4 },
    { range: "5–6", min: 5, max: 6 },
    { range: "7+", min: 7, max: Infinity },
  ];

  const data = buckets.map((b) => ({
    range: b.range,
    count: counts.filter((c) => c >= b.min && c <= b.max).length,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Skill Passport Distribution
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="range" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="count" fill="#7c3aed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}