import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";

import { type Participant } from "../data/Students";
import { Button } from "@/components/ui/button";
import RadarProfileChart from "../components/RadarChart";
import { ResponsiveContainer } from "recharts";

import {
  SKILL_TO_DOMAIN,
} from "../components/ScoreStudentDomains";

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

export default function CandidateProfilePage({
  students,
}: {
  students: Participant[];
}) {
  const { id } = useParams();

  const navigate = useNavigate();

  const [expandedDomains, setExpandedDomains] = useState<
    Record<string, boolean>
  >({});

  const [selectedStamp, setSelectedStamp] =
    useState<any>(null);

  const student = students.find((s) => s.uid === id);

  if (!student) {
    return <div className="p-6">Student not found</div>;
  }

  const groupedDomains = useMemo(() => {
    const grouped: Record<
      string,
      typeof student.skillPassport
    > = {};

    for (const sp of student.skillPassport ?? []) {
      const key = normalize(sp.category);

      const domains =
        SKILL_TO_DOMAIN[key] ?? ["Other"];

      for (const domain of domains) {
        if (!grouped[domain]) {
          grouped[domain] = [];
        }

        grouped[domain].push(sp);
      }
    }

    return grouped;
  }, [student.skillPassport]);

  const toggleDomain = (domain: string) => {
    setExpandedDomains((prev) => ({
      ...prev,
      [domain]: !prev[domain],
    }));
  };

  return (
    <>
      {selectedStamp && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedStamp(null)}
          />

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-full flex items-start justify-center p-6">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
                <div className="flex items-center justify-between border-b px-6 py-4">
                  <div>
                    <h2 className="text-xl font-bold">
                      {selectedStamp.category}
                    </h2>

                    <p className="text-sm text-gray-500">
                      Stamp Details
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedStamp(null)
                    }
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                      Domains
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {(
                        SKILL_TO_DOMAIN[
                          normalize(selectedStamp.category)
                        ] ?? ["Other"]
                      ).map((domain: string) => (
                        <span
                          key={domain}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                        >
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <p className="text-xs text-gray-400 mb-1">
                        Total Mappings
                      </p>

                      <p className="text-xl font-semibold">
                        {selectedStamp.totalMappings}
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <p className="text-xs text-gray-400 mb-1">
                        Current Status
                      </p>

                      <p className="text-sm font-medium text-green-600">
                        Active
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="border rounded-lg p-4">
                      <p className="text-xs text-gray-400 mb-1">
                        First Earned
                      </p>

                      <p className="text-sm font-medium">
                        {new Date(
                          selectedStamp.firstMappedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <p className="text-xs text-gray-400 mb-1">
                        Last Active
                      </p>

                      <p className="text-sm font-medium">
                        {new Date(
                          selectedStamp.lastMappedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-xl p-5 bg-gray-50 space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm">
                        Evidence & Context
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Rich evidence support is coming soon.
                      </p>
                    </div>

                    <div className="border border-dashed rounded-lg p-4 bg-white">
                      <p className="text-sm text-gray-500">
                        Future versions of this badge will include:
                      </p>

                      <ul className="mt-3 space-y-2 text-sm text-gray-600 list-disc list-inside">
                        <li>Conversation excerpts and quotes</li>
                        <li>Session participation evidence</li>
                        <li>Mentor observations and notes</li>
                        <li>Linked projects and artifacts</li>
                        <li>Timeline progression for this skill</li>
                        <li>Contextual mapping explanations</li>
                      </ul>
                    </div>

                    <div className="text-xs text-gray-400 italic">
                      No evidence has been attached to this stamp yet.
                    </div>
                  </div>
                </div>

                <div className="border-t px-6 py-4 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setSelectedStamp(null)
                    }
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <div>
            <h1 className="text-2xl font-bold">
              {student.displayName ??
                "Anonymous Participant"}
            </h1>

            <p className="text-sm text-gray-500">
              {student.email}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">
              Holistic Profile
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <RadarProfileChart student={student} />
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-lg shadow space-y-3">
            <h2 className="font-semibold">
              Traditional Info
            </h2>

            <div className="text-sm text-gray-600">
              GPA:{" "}
              <span className="font-medium text-gray-400">
                —
              </span>
            </div>

            <div className="text-sm text-gray-600">
              Skill Areas:{" "}
              <span className="font-medium">
                {student.skillPassport.length}
              </span>
            </div>

            <div className="text-sm text-gray-600">
              Email: {student.email}
            </div>

            <div className="text-sm text-gray-600">
              Joined:{" "}
              {new Date(
                student.createdAt
              ).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-4">
            Skill Domain Explorer
          </h2>

          <div className="space-y-4">
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
                      <div className="p-4 flex flex-wrap gap-2 bg-white">
                        {skills.map((s) => (
                          <button
                            key={`${s.category}-${s.firstMappedAt}`}
                            onClick={() =>
                              setSelectedStamp(s)
                            }
                            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded transition"
                          >
                            {s.category}
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
      </div>
    </>
  );
}