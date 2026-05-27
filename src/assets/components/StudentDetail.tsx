import { useMemo, useState } from "react";

import {
  X,
  Mail,
  Calendar,
  Award,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useNavigate } from "react-router-dom";

import RadarProfileChart from "../components/RadarChart";

import {
  SKILL_TO_DOMAIN,
} from "../components/ScoreStudentDomains";

import { type Participant } from "../data/Students";

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

export default function StudentDetailModal({
  participant,
  onClose,
}: {
  participant: Participant;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  const [expandedDomains, setExpandedDomains] = useState<
    Record<string, boolean>
  >({});

  const skillCount = participant.skillPassport.length;

  const totalMappings = participant.skillPassport.reduce(
    (sum, sp) => sum + sp.totalMappings,
    0
  );

  const displayName = participant.displayName ?? participant.email;

  const groupedDomains = useMemo(() => {
    const grouped: Record<
      string,
      typeof participant.skillPassport
    > = {};

    for (const sp of participant.skillPassport ?? []) {
      const key = normalize(sp.category);

      const domains = SKILL_TO_DOMAIN[key] ?? ["Other"];

      for (const domain of domains) {
        if (!grouped[domain]) {
          grouped[domain] = [];
        }

        grouped[domain].push(sp);
      }
    }

    return grouped;
  }, [participant.skillPassport]);

  const toggleDomain = (domain: string) => {
    setExpandedDomains((prev) => ({
      ...prev,
      [domain]: !prev[domain],
    }));
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">
                {displayName}
              </h2>

              <p className="text-sm text-gray-500">
                {participant.email}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  Skill Passport Overview
                </h3>

                <RadarProfileChart student={participant} />
              </div>

              <div className="space-y-4">
                {Object.keys(groupedDomains).length > 0 && (
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">
                      Skill Domain Explorer
                    </h3>

                    <div className="space-y-3">
                      {Object.entries(groupedDomains).map(
                        ([domain, skills]) => {
                          const expanded =
                            expandedDomains[domain];

                          return (
                            <div
                              key={domain}
                              className="border rounded-lg overflow-hidden"
                            >
                              <button
                                onClick={() =>
                                  toggleDomain(domain)
                                }
                                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
                              >
                                <div className="flex items-center gap-2">
                                  {expanded ? (
                                    <ChevronDown size={16} />
                                  ) : (
                                    <ChevronRight size={16} />
                                  )}

                                  <span className="font-medium text-sm">
                                    {domain}
                                  </span>

                                  <span className="text-xs text-gray-500">
                                    ({skills.length})
                                  </span>
                                </div>
                              </button>

                              {expanded && (
                                <div className="p-3 flex flex-wrap gap-2 bg-white">
                                  {skills.map((sp) => (
                                    <button
                                      key={`${sp.category}-${sp.firstMappedAt}`}
                                      className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition"
                                      onClick={() => {
                                        // TODO:
                                        // stamp detail modal
                                        console.log(
                                          "Selected stamp:",
                                          sp
                                        );
                                      }}
                                    >
                                      {sp.category}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">
                    Engagement
                  </h3>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-800">
                        {skillCount}
                      </span>{" "}
                      skill areas unlocked
                    </p>

                    <p>
                      <span className="font-medium text-gray-800">
                        {totalMappings}
                      </span>{" "}
                      total interactions mapped
                    </p>

                    <p className="text-gray-400 italic text-xs mt-2">
                      Session tracking coming soon
                    </p>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4 space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Mail
                      size={14}
                      className="text-gray-400"
                    />

                    {participant.email}
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar
                      size={14}
                      className="text-gray-400"
                    />

                    Joined{" "}
                    {new Date(
                      participant.createdAt
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <Award
                      size={14}
                      className="text-gray-400"
                    />

                    Last active{" "}
                    {new Date(
                      participant.lastActiveAt
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>

            {skillCount > 0 && (
              <section>
                <h3 className="font-semibold mb-3">
                  Skill Passport
                </h3>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Skill</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>Total Mappings</TableHead>
                      <TableHead>First Earned</TableHead>
                      <TableHead>Last Active</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {participant.skillPassport.map((sp) => {
                      const domains =
                        SKILL_TO_DOMAIN[
                          normalize(sp.category)
                        ] ?? ["Other"];

                      return (
                        <TableRow
                          key={`${sp.category}-${sp.firstMappedAt}`}
                        >
                          <TableCell className="font-medium">
                            {sp.category}
                          </TableCell>

                          <TableCell>
                            {domains.join(", ")}
                          </TableCell>

                          <TableCell>
                            {sp.totalMappings}
                          </TableCell>

                          <TableCell>
                            {new Date(
                              sp.firstMappedAt
                            ).toLocaleDateString()}
                          </TableCell>

                          <TableCell>
                            {new Date(
                              sp.lastMappedAt
                            ).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </section>
            )}
          </div>

          <div className="border-t p-4 flex justify-between items-center bg-gray-50">
            <Button
              variant="outline"
              onClick={() => {
                onClose();

                navigate(
                  `/dashboard/candidates/${participant.uid}`
                );
              }}
            >
              View Full Profile
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>

              <Button disabled title="Coming soon">
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}