import type { Participant } from "../data/Students";
import type { PrintableStamp } from "../../utils/printReport";
import { computeRadarData, StaticRadarChart } from "./RadarChart";

function formatDate(value: string | number | null | undefined) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

function formatAddress(address: Participant["address"]) {
  if (!address) return "—";
  const parts = [address.street, address.city, address.state, address.postalCode, address.country].filter(
    Boolean
  );
  return parts.length ? parts.join(", ") : "—";
}

export default function PrintableProfile({
  participant,
  stamps,
}: {
  participant: Participant;
  stamps: PrintableStamp[];
}) {
  const displayName = participant.fullName || participant.displayName || "Unnamed Participant";
  const radarData = computeRadarData(stamps);

  const grouped = stamps.reduce<Record<string, PrintableStamp[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="print-report hidden print:block print:text-black">
      <style>{`
        @page {
          size: letter;
          margin: 0.75in;
        }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      {/* Header */}
      <div className="border-b-2 border-black pb-3 mb-4" style={{ breakInside: "avoid" }}>
        <p className="text-xs uppercase tracking-wide text-gray-500">
          Promise Unlocked Portal — Student Report
        </p>
        <h1 className="text-xl font-bold mt-1">{displayName}</h1>
        <p className="text-sm text-gray-600">
          UID: {participant.uid}
          {participant.email ? ` — ${participant.email}` : ""}
        </p>
        <p className="text-xs text-gray-400 mt-1">Printed {new Date().toLocaleDateString()}</p>
      </div>

      {/* Radar Chart */}
      <div className="mb-6" style={{ breakInside: "avoid" }}>
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-2">Skill Radar</h2>
        <StaticRadarChart data={radarData} />
      </div>

      {/* Participant Information */}
      <div className="mb-6" style={{ breakInside: "avoid" }}>
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-2 border-b pb-1">
          Participant Information
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
          <div><span className="text-gray-500">Email:</span> {participant.email ?? "—"}</div>
          <div><span className="text-gray-500">Phone:</span> {participant.phone ?? "—"}</div>
          <div><span className="text-gray-500">Gender:</span> {participant.gender ?? "—"}</div>
          <div><span className="text-gray-500">Date of Birth:</span> {formatDate(participant.dateOfBirth)}</div>
          <div><span className="text-gray-500">School:</span> {participant.schoolName ?? "—"}</div>
          <div><span className="text-gray-500">School Address:</span> {participant.schoolAddress ?? "—"}</div>
          <div className="col-span-2">
            <span className="text-gray-500">Address:</span> {formatAddress(participant.address)}
          </div>
          <div><span className="text-gray-500">Joined:</span> {formatDate(participant.createdAt)}</div>
          <div><span className="text-gray-500">Last Active:</span> {formatDate(participant.lastActiveAt)}</div>
        </div>
      </div>

      {/* Passport Summary — markdown-styled */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-2 border-b pb-1">
          Passport Summary
        </h2>

        {stamps.length === 0 && <p className="text-sm text-gray-400">No stamps earned yet.</p>}

        {Object.entries(grouped).map(([category, categoryStamps]) => (
          <div key={category} className="mb-4" style={{ breakInside: "avoid" }}>
            <p className="text-xs font-bold uppercase text-gray-500 mb-1">{category}</p>

            {categoryStamps.map((s) => (
              <div key={s.stampName} className="mb-3 pl-2" style={{ breakInside: "avoid" }}>
                <p className="font-mono text-sm font-semibold">
                  {s.stampName}{" "}
                  <span className="font-sans font-normal text-gray-500 text-xs">(Tier {s.tier})</span>
                </p>

                {s.justifications.length > 0 ? (
                  <ul className="list-disc pl-6 mt-1 space-y-0.5">
                    {s.justifications.map((j, idx) => (
                      <li key={idx} className="text-xs text-gray-800">{j}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400 pl-6 mt-1">No justification recorded.</p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}