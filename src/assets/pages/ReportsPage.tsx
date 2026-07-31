import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { REGIONS } from "../data/Taxonomy";

import {
  ApplicationsByProgramChart,
  StatusBreakdownChart,
  GpaDistributionChart,
} from "../components/ReportsCharts";

import { type Participant } from "../data/Students";
import { getStampCategorySummary, type StampCategorySummary } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

interface ReportsPageProps {
  students: Participant[];
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
  const { token } = useAuth();
  const [categorySummary, setCategorySummary] = useState<StampCategorySummary[]>([]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    getStampCategorySummary(token)
      .then((data) => {
        if (!cancelled) setCategorySummary(data);
      })
      .catch(console.error); // silent fail — chart falls back to client-side counts

    return () => {
      cancelled = true;
    };
  }, [token]);

  const totalProfiles = students.length;

  const domainCounts: Record<string, number> = Object.fromEntries(
    REGIONS.map((region) => [region, 0])
  );

  if (categorySummary.length > 0) {
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

  const topCategory =
    Object.entries(domainCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Total Profiles"
          value={totalProfiles}
          accent="border-l-blue-500"
        />

        <StatCard
          label="Top Skill Area"
          value={topCategory}
          accent="border-l-yellow-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ApplicationsByProgramChart
          students={students}
          categorySummary={categorySummary}
        />
        <StatusBreakdownChart students={students} />
      </div>

      <GpaDistributionChart students={students} />
    </div>
  );
}