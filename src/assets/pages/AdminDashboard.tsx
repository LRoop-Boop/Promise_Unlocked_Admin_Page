import { Routes, Route } from "react-router-dom";
import { Users, TrendingUp, Clock, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";

import ReportsPage from "./ReportsPage";
import CandidatesPage from "./CandidatePage";
import CandidateProfilePage from "./CandidateProfilePage";
import TaxonomyPage from "./TaxonomyPage";
import CandidateTable from "../components/CandidateTable";
import { DashboardShell } from "../../components/DashboardShell";
import { DashboardHomeSkeleton } from "../../components/PageSkeletons";
import { ConnectionBanner } from "../../components/ConnectionBanner";
import { ApplicationsByProgramChart } from "../components/ReportsCharts";
import {
  getStampCategorySummary,
  getAllPassports,
  type StampCategorySummary,
  type ParticipantPassportSummary,
} from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { isAuthError, isNetworkError } from "../../lib/apiErrors";
import { Participant } from "../data/Students";

interface AdminDashboardProps {
  students: Participant[];
}

function StatCard({
  icon: Icon, label, value, color,
}: { icon: React.ElementType; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function DashboardHome({
  students,
  passportByUid,
  passportsLoading,
}: {
  students: Participant[];
  passportByUid: Record<string, ParticipantPassportSummary>;
  passportsLoading: boolean;
}) {
  const { token, logout } = useAuth();
  const [categorySummary, setCategorySummary] = useState<StampCategorySummary[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    setSummaryLoading(true);
    getStampCategorySummary(token)
      .then((data) => {
        if (!cancelled) setCategorySummary(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (isAuthError(err)) {
          logout();
        } else if (isNetworkError(err)) {
          // DashboardHome doesn't own the banner - the parent's passport
          // fetch surfaces it, this one just logs quietly to avoid duplicates
          console.error("Stamp category summary unreachable:", err);
        } else {
          console.error(err);
        }
      })
      .finally(() => {
        if (!cancelled) setSummaryLoading(false);
      });

    return () => { cancelled = true; };
  }, [token, logout]);

  const loading = passportsLoading || summaryLoading;

  if (loading) {
    return <DashboardHomeSkeleton />;
  }

  const metrics = {
    total: students.length,
    newProfiles: students.length,
    reviewed: 0,
    mappedSkills: Object.values(passportByUid).reduce(
      (sum, p) => sum + p.totalStampsUnlocked,
      0
    ),
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Participants" value={metrics.total} color="bg-blue-500" />
        <StatCard icon={Clock} label="New Profiles" value={metrics.newProfiles} color="bg-yellow-500" />
        <StatCard icon={UserCheck} label="Reviewed Profiles" value={metrics.reviewed} color="bg-purple-500" />
        <StatCard icon={TrendingUp} label="Mapped Skills" value={metrics.mappedSkills} color="bg-green-500" />
      </div>

      <div className="space-y-6">
        <ApplicationsByProgramChart students={students} categorySummary={categorySummary} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck size={18} className="text-yellow-500" />
          <h2 className="text-base font-semibold text-gray-800">New Participant Profiles</h2>
          <span className="ml-auto text-sm text-gray-400">{metrics.newProfiles} profiles</span>
        </div>

        <CandidateTable students={students} passportByUid={passportByUid} />
      </div>
    </div>
  );
}

export default function AdminDashboard({ students }: AdminDashboardProps) {
  const { token, logout } = useAuth();
  const [passportByUid, setPassportByUid] = useState<Record<string, ParticipantPassportSummary>>({});
  const [passportsLoading, setPassportsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    setPassportsLoading(true);
    setConnectionError(false);

    getAllPassports(token)
      .then((summaries) => {
        if (cancelled) return;
        const map: Record<string, ParticipantPassportSummary> = {};
        for (const s of summaries) map[s.uid] = s;
        setPassportByUid(map);
      })
      .catch((err) => {
        if (cancelled) return;
        if (isAuthError(err)) logout();
        else if (isNetworkError(err)) setConnectionError(true);
        else console.error(err);
      })
      .finally(() => { if (!cancelled) setPassportsLoading(false); });

    return () => { cancelled = true; };
  }, [token, logout]);

  return (
    <DashboardShell>
      {connectionError && <ConnectionBanner />}
      <Routes>
        <Route path="" element={<DashboardHome students={students} passportByUid={passportByUid} passportsLoading={passportsLoading} />} />
        <Route path="candidates/:id" element={<CandidateProfilePage students={students} passportByUid={passportByUid} />} />
        <Route path="candidates" element={<CandidatesPage students={students} passportByUid={passportByUid} />} />
        <Route path="reports" element={<ReportsPage students={students} passportByUid={passportByUid} />} />
        <Route path="taxonomy" element={<TaxonomyPage />} />
      </Routes>
    </DashboardShell>
  );
}