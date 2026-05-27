import SKILLS_TAXONOMY from "../data/Taxonomy";
import { Participant } from "../data/Students";

const normalize = (v: unknown): string => {
  if (typeof v === "string") {
    return v.toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  if (typeof v === "object" && v !== null) {
    const obj = v as any;
    const extracted = obj.label ?? obj.name ?? obj.category;
    return typeof extracted === "string"
      ? extracted.toLowerCase().replace(/[^a-z0-9]/g, "")
      : "";
  }

  return "";
};

export const SKILL_TO_DOMAIN: Record<string, string[]> = {};

Object.entries(SKILLS_TAXONOMY).forEach(([domain, skills]) => {
  skills.forEach((skill) => {
    const key = normalize(skill);
    if (!SKILL_TO_DOMAIN[key]) SKILL_TO_DOMAIN[key] = [];
    SKILL_TO_DOMAIN[key].push(domain);
  });
});

export function scoreStudentDomains(student: Participant) {
  const counts: Record<string, number> = {};

  for (const sp of student.skillPassport ?? []) {
    const key = normalize(sp?.category);

    const domains = SKILL_TO_DOMAIN[key] ?? [];

    for (const d of domains) {
      counts[d] = (counts[d] ?? 0) + 1;
    }
  }

  return Object.entries(counts).map(([domain, score]) => ({
    domain,
    score,
  }));
}