import { useState, useEffect } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { REGIONS } from "../data/Taxonomy";
import { getParticipantStamps, type StampInstance } from "../../api/client";

const radarLabelMap: Record<string, string> = {
  "Human Skills (Durable)": "Human Skills",
  "Creative Expression & Communication": "Creative",
  "Problem-Solving & Systems Thinking": "Problem-Solving",
  "Work & Entrepreneurial Experience": "Work & Entrepreneurship",
  "Future Self & Directionality": "Future Self",
  "Meta-Learning & Self-Awareness": "Meta-Learning",
  "Maker & Builder Skills": "Maker & Builder",
  "Civic & Community Impact": "Civic & Community",
  "Digital & Tech Fluency": "Tech Fluency",
  "Wellbeing & Personal Resilience": "Wellbeing",
  "Faith, Culture & Identity": "Faith & Culture",
};

const TIER_TARGET_PER_REGION = 3;
const RADAR_FLOOR = 8;
const DEFAULT_TIER = 0; // TODO: confirm against mobile's config/stampConstants

export function computeRadarData(stamps: { category: string; tier: number }[]) {
  const tierPoints: Record<string, number> = {};

  for (const s of stamps) {
    const current = tierPoints[s.category] ?? 0;
    const tier = s.tier ?? DEFAULT_TIER;
    tierPoints[s.category] = Math.max(current, tier);
  }

  return REGIONS.map((region) => {
    const points = tierPoints[region] ?? 0;
    const pct = Math.min(100, (points / TIER_TARGET_PER_REGION) * 100);
    return {
      domain: radarLabelMap[region] ?? region,
      value: Math.max(pct, RADAR_FLOOR),
      rawTier: points,
    };
  });
}

function RadarTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { domain, rawTier } = payload[0].payload;
  return (
    <div className="bg-white border rounded shadow px-3 py-2 text-xs">
      <p className="font-semibold">{domain}</p>
      <p className="text-gray-500">Tier {rawTier} of {TIER_TARGET_PER_REGION}</p>
    </div>
  );
}

export default function RadarProfileChart({
  token,
  participantId,
}: {
  token: string;
  participantId: string;
}) {
  const [stamps, setStamps] = useState<StampInstance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !participantId) return;
    let cancelled = false;
    setLoading(true);
    getParticipantStamps(token, participantId)
      .then((data) => {
        if (!cancelled) setStamps(data);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, participantId]);

  if (loading) {
    return <div className="text-sm text-gray-400 h-[300px] flex items-center justify-center">Loading radar...</div>;
  }

  const data = computeRadarData(stamps);

  return (
    <div className="w-full h-[300px] min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11, fill: "#6b7280" }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar dataKey="value" stroke="#2E6EE6" fill="#2E6EE6" fillOpacity={0.18} strokeWidth={2} />
          <Tooltip content={<RadarTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StaticRadarChart({ data }: { data: ReturnType<typeof computeRadarData> }) {
  return (
    <RadarChart width={500} height={280} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11, fill: "#374151" }} />
      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
      <Radar dataKey="value" stroke="#2E6EE6" fill="#2E6EE6" fillOpacity={0.18} strokeWidth={2} isAnimationActive={false} />
    </RadarChart>
  );
}