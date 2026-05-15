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
import { type Student } from "../data/Students";

interface ChartProps {
  students: Student[];
}

export function ApplicationsByProgramChart({ students }: ChartProps) {
  const programCounts = Object.entries(
    students.reduce((acc, s) => {
      const key = s.program ?? "Undeclared";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([program, count]) => ({ program, count }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Profiles by Program
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={programCounts}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="program" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="count" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusBreakdownChart({ students }: ChartProps) {
  const statusOrder = ["Accepted", "In Review", "Pending", "Rejected"] as const;

  const statusCounts = statusOrder.map((status) => ({
    name: status,
    value: students.filter((s) => s.status === status).length,
  }));

  const COLORS = {
    Accepted: "#22c55e",
    "In Review": "#eab308",
    Pending: "#94a3b8",
    Rejected: "#ef4444",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Profile Status Overview
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={statusCounts}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
          >
            {statusCounts.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS]} />
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
  const buckets = [
    { range: "2.5–2.9", min: 2.5, max: 2.99 },
    { range: "3.0–3.4", min: 3.0, max: 3.49 },
    { range: "3.5–3.9", min: 3.5, max: 3.99 },
    { range: "4.0", min: 4.0, max: 4.0 },
  ];

  const data = buckets.map((b) => ({
    range: b.range,
    count: students.filter((s) => s.gpa >= b.min && s.gpa <= b.max).length,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        GPA Distribution
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