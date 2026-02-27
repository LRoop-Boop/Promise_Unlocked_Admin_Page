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
import { students, type Status } from '../data/Students';

const programCounts = Object.entries(
  students.reduce((acc, s) => {
    acc[s.program] = (acc[s.program] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>)
).map(([program, count]) => ({ program, count }));

const STATUS_COLORS: Record<Status, string> = {
  Accepted:   "#22c55e",
  "In Review": "#eab308",
  Pending:    "#94a3b8",
  Rejected:   "#ef4444",
};

const statusCounts = (["Accepted", "In Review", "Pending", "Rejected"] as Status[]).map(
  (status) => ({
    name: status,
    value: students.filter((s) => s.status === status).length,
  })
);

// GPA distribution buckets
const gpaBuckets = [
  { range: "2.5 – 2.9", min: 2.5, max: 2.99 },
  { range: "3.0 – 3.4", min: 3.0, max: 3.49 },
  { range: "3.5 – 3.9", min: 3.5, max: 3.99 },
  { range: "4.0",       min: 4.0, max: 4.0  },
].map((bucket) => ({
  range: bucket.range,
  count: students.filter((s) => s.gpa >= bucket.min && s.gpa <= bucket.max).length,
}));

// ── Sub-components ────────────────────────────────────────────────────────────

export function ApplicationsByProgramChart() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Applications by Program</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={programCounts} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="program" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} name="Applicants" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusBreakdownChart() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Status Breakdown</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={statusCounts}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {statusCounts.map((entry) => (
              <Cell key={entry.name} fill={STATUS_COLORS[entry.name as Status]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GpaDistributionChart() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">GPA Distribution</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={gpaBuckets} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="range" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Students" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}