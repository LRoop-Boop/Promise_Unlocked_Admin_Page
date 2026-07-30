import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";

import { type Participant } from "../data/Students";
import { Button } from "@/components/ui/button";
import RadarProfileChart from "../components/RadarChart";
import { getPvaCatalog, type ApiPva } from "../../api/client";

import StampsPanel from "../components/StampsPanel";
import ChatLogPanel from "../components/ChatLogPanel";
import { useAuth } from "../../context/AuthContext";

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
  const { token } = useAuth();
  const navigate = useNavigate();

  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({});

  const [selectedStamp, setSelectedStamp] = useState<any>(null);

  const [pvas, setPvas] = useState<ApiPva[]>([]);

  const student = students.find((s) => s.uid === id);

  const groupedDomains = useMemo(() => {
    const grouped: Record<string, Participant["skillPassport"]> = {};

    for (const sp of student?.skillPassport ?? []) {
      const domain = sp.category;
      if (!grouped[domain]) grouped[domain] = [];
      grouped[domain].push(sp);
    }

    return grouped;
  }, [student?.skillPassport]);

  const toggleDomain = (domain: string) => {
    setExpandedDomains((prev) => ({
      ...prev,
      [domain]: !prev[domain],
    }));
  };

  if (!student) {
    return <div className="p-6">Student not found</div>;
  }

  const selectedPvaName =
    pvas.find((p) => p.id === student.selectedPvaId)?.name ?? "None";

  const totalStamps = student.skillPassport.reduce(
    (sum, sp) => sum + sp.totalMappings,
    0
  );

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    getPvaCatalog(token)
      .then((data) => {
        if (!cancelled) {
          setPvas(data);
        }
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [token]);

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
                    <p className="text-sm text-gray-500">Stamp Details</p>
                  </div>

                  <button
                    onClick={() => setSelectedStamp(null)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                      Category
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                       {selectedStamp.category}
                     </span>
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
                        Date Earned
                      </p>
                      <p className="text-xl font-semibold">
                        {new Date(
                          selectedStamp.firstMappedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-xl p-5 bg-gray-50 space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm">Evidence</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        See the "Earned Stamps" section below for individual
                        stamp evidence with question/answer/justification.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t px-6 py-4 flex justify-end">
                  <Button variant="outline" onClick={() => setSelectedStamp(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <div>
            <h1 className="text-2xl font-bold">
              {student.displayName ?? "Anonymous Participant"}
            </h1>
            <p className="text-sm text-gray-500">{student.email}</p>
          </div>

          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Holistic Profile</h2>

            {token ? (
             <RadarProfileChart token={token} participantId={student.uid} />
           ) : (
             <p className="text-sm text-gray-500">
               Sign in as an admin to view the growth radar.
             </p>
           )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow space-y-4">
            <h2 className="font-semibold text-lg">Participant Information</h2>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">

              <div>
                <p className="text-gray-400">Full Name</p>
                <p>{student.displayName ?? "Not provided"}</p>
              </div>

              <div>
                <p className="text-gray-400">Email</p>
                <p>{student.email ?? "Not provided"}</p>
              </div>

              <div>
                <p className="text-gray-400">Phone</p>
                <p>{student.phone ?? "Not provided"}</p>
              </div>

              <div>
                <p className="text-gray-400">Gender</p>
                <p>{student.gender ?? "Not provided"}</p>
              </div>

              <div>
                <p className="text-gray-400">Ethnicity</p>
                <p>{student.ethnicity ?? "Not provided"}</p>
              </div>

              <div>
                <p className="text-gray-400">Date of Birth</p>
                <p>{student.dateOfBirth ?? "Not provided"}</p>
              </div>

              <div>
                <p className="text-gray-400">Selected PVA</p>
                <p>{selectedPvaName}</p>
              </div>

              <div>
                <p className="text-gray-400">Address</p>
                <p>{student.address?.street ?? "Not provided"}</p>
              </div>

              <div>
                <p className="text-gray-400">School</p>
                <p>{student.schoolName ?? "Not provided"}</p>
              </div>

              <div>
                <p className="text-gray-400">School Address</p>
                <p>{student.schoolAddress ?? "Not provided"}</p>
              </div>

              <div>
                <p className="text-gray-400">Joined</p>
                <p>{new Date(student.createdAt).toLocaleDateString()}</p>
              </div>

              <div>
                <p className="text-gray-400">Last Active</p>
                <p>
                  {student.lastActiveAt
                    ? new Date(student.lastActiveAt).toLocaleDateString()
                    : "Never"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-4">Passport Summary</h2>

          {token ? (
            <StampsPanel token={token} participantId={student.uid} selectedPvaId={student.selectedPvaId}/>
          ) : (
            <p className="text-sm text-gray-500">
              Sign in as an admin to view earned stamps and evidence.
            </p>
          )}
        </div>

        {/* --- Chat Logs (full transcript, safety review) --- */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-4">Chat Logs</h2>

          {token ? (
            <ChatLogPanel token={token} participantId={student.uid} />
          ) : (
            <p className="text-sm text-gray-500">
              Sign in as an admin to view chat logs.
            </p>
          )}
        </div>
      </div>
    </>
  );
}