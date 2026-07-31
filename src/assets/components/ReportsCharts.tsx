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
import { REGIONS } from "../data/Taxonomy";
import { type StampCategorySummary } from "../../api/client";

interface ChartProps {
  students: Participant[];
}

interface ApplicationsByProgramChartProps extends ChartProps {
  categorySummary?: StampCategorySummary[];
}

export function ApplicationsByProgramChart({
  students,
  categorySummary,
}: ApplicationsByProgramChartProps) {
  const domainCounts: Record<string, number> = Object.fromEntries(
    REGIONS.map((region) => [region, 0])
  );

  if (categorySummary && categorySummary.length > 0) {
    for (const c of categorySummary) {
      if (c.category in domainCounts) {
        domainCounts[c.category] = c.totalUnlocks;
      }
    }
  } else {
    students.forEach((student) => {
      for (const sp of student.skillPassport ?? []) {
        if (sp.category in domainCounts) {
          domainCounts[sp.category] += sp.totalMappings;
        }
      }
    });
  }

  const chartData = REGIONS.map((domain) => ({
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
            height={100}
            tick={({ x, y, payload }) => (
              <g transform={`translate(${x},${y})`}>
                <text
                  x={0}
                  y={0}
                  dy={4}
                  textAnchor="end"
                  fill="#6b7280"
                  fontSize={10}
                  transform="rotate(-35)"
                >
                  {payload.value}
                </text>
              </g>
            )}
          />

          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />

          <Bar dataKey="count" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusBreakdownChart({ students }: ChartProps) {
  const reviewed = 0;

  const newProfiles = students.length - reviewed;

  const statusCounts = [
    { name: "Reviewed", value: reviewed },
    { name: "New Profiles", value: newProfiles },
  ];

  const COLORS: Record<string, string> = {
    Reviewed: "#22c55e",
    "New Profiles": "#94a3b8",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Profile Review Status
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

export function GpaDistributionChart({ students }: ChartProps) {
  const safeStudents = students ?? [];

  const counts = safeStudents.map((s) =>
    (s?.skillPassport ?? []).reduce((sum, sp) => sum + sp.totalMappings, 0)
  );

  const buckets = [
    { range: "0", min: 0, max: 0 },
    { range: "1–3", min: 1, max: 3 },
    { range: "4–6", min: 4, max: 6 },
    { range: "7–10", min: 7, max: 10 },
    { range: "11+", min: 11, max: Infinity },
  ];

  const data = buckets.map((b) => ({
    range: b.range,
    count: counts.filter((c) => c >= b.min && c <= b.max).length,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Total Stamps Distribution
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