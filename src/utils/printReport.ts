import {
  getParticipantStamps,
  getStampEvidence,
  type StampInstance,
} from "../api/client";

export interface PrintableStamp {
  stampName: string;
  category: string;
  tier: number;
  justifications: string[];
}

export async function buildPrintableStamps(
  token: string,
  participantId: string
): Promise<PrintableStamp[]> {
  const stamps: StampInstance[] = await getParticipantStamps(token, participantId);

  const enriched = await Promise.all(
    stamps.map(async (s) => {
      let justifications: string[] = [];
      try {
        const { interactions } = await getStampEvidence(
          token,
          participantId,
          s.sessionId,
          s.stampName
        );
        justifications = interactions
          .map((i) => i.justification)
          .filter((j): j is string => Boolean(j && j.trim().length > 0));
      } catch (e) {
        console.error(`Failed to load evidence for stamp ${s.stampName}:`, e);
      }

      return {
        stampName: s.stampName,
        category: s.category,
        tier: s.tier,
        justifications,
      };
    })
  );

  // Group nicely by category, alphabetical within category
  return enriched.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.stampName.localeCompare(b.stampName);
  });
}