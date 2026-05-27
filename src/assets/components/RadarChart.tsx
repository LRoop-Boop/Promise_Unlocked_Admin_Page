import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import SKILLS_TAXONOMY from "../data/Taxonomy";
import { Participant } from "../data/Students";

const STAMP_TO_DOMAIN: Record<string, string> = {};
console.log("SKILLS_TAXONOMY RAW:", SKILLS_TAXONOMY);

Object.entries(SKILLS_TAXONOMY).forEach(([domain, stamps]) => {
  (stamps ?? []).forEach((stamp) => {
    STAMP_TO_DOMAIN[stamp] = domain;
  });
});

function computeRadarData(student: Participant) {
  const counts: Record<string, number> = {};

  for (const sp of student.skillPassport ?? []) {
    const stamp = sp.category;
    const domain = STAMP_TO_DOMAIN[stamp];

    if (!domain) continue;

    counts[domain] = (counts[domain] ?? 0) + 1;
  }

  const max = Math.max(...Object.values(counts), 1);

  return Object.keys(SKILLS_TAXONOMY).map((domain) => {
    const raw = (counts[domain] ?? 0) / max;

    return {
        domain,
        value: Math.max(raw, 0.1),
    };
  });
}

export default function RadarProfileChart({
  student,
}: {
  student: Participant;
}) {
  const data = computeRadarData(student);

  return (
    <div className="w-full h-[300px] min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11, fill: "#6b7280" }} />
          <PolarRadiusAxis domain={[0, 1]} tick={false} axisLine={false} />

          <Radar
            dataKey="value"
            fill="#3b82f6"
            fillOpacity={0.5}
          />

          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}