import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Users,
  BarChart3,
  Bell,
  Mail,
  Menu,
  GraduationCap,
  TrendingUp,
  Clock,
  CheckCircle,
  UserCheck,
} from "lucide-react";

import ApplicationsPage from "./ApplicationsPage";
import ReportsPage from "./ReportsPage";
import CandidatesPage from "./CandidatePage";
import CandidateTable from "../components/CandidateTable";
import { Student } from "../data/Students";
import CandidateProfilePage from "./CandidateProfilePage";
import {
  ApplicationsByProgramChart,
  StatusBreakdownChart,
} from "../components/ReportsCharts";

interface AdminDashboardProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
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

function DashboardHome({ students }: { students: Student[] }) {
  const metrics = {
    total: students.length,
    newApplications: students.filter((s) => s.status === "Pending").length,
    inReview: students.filter((s) => s.status === "In Review").length,
    accepted: students.filter((s) => s.status === "Accepted").length,
  };

  return (
    <div className="space-y-6">

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Users}       label="Total Candidates"   value={metrics.total}            color="bg-blue-500" />
        <StatCard icon={Clock}       label="New Applications"   value={metrics.newApplications}  color="bg-yellow-500" />
        <StatCard icon={TrendingUp}  label="In Review"          value={metrics.inReview}         color="bg-purple-500" />
        <StatCard icon={CheckCircle} label="Accepted"           value={metrics.accepted}         color="bg-green-500" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-6">
        <StatusBreakdownChart students={students} />
        <ApplicationsByProgramChart students={students} />
      </div>

      {/* Pending table */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck size={18} className="text-yellow-500" />
          <h2 className="text-base font-semibold text-gray-800">
            Awaiting Review
          </h2>
          <span className="ml-auto text-sm text-gray-400">
            {metrics.newApplications} pending
          </span>
        </div>

        <CandidateTable
          students={students}
          filter={(s) => s.status === "Pending"}
        />
      </div>
    </div>
  );
}

const navItems = [
  { icon: Home,    label: "Dashboard",    path: "" },
  { icon: FileText, label: "Applications", path: "applications" },
  { icon: Users,   label: "Candidates",   path: "candidates" },
  { icon: BarChart3, label: "Reports",    path: "reports" },
];

export default function AdminDashboard({ students }: AdminDashboardProps) {
  const location = useLocation();

  const currentLabel =
    navItems.find((item) => `/dashboard/${item.path}` === location.pathname)
      ?.label ?? "Dashboard";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-blue-600 text-white flex flex-col">
        <div className="p-4 flex items-center gap-2 border-b border-blue-500">
          <GraduationCap size={22} />
          <span className="font-semibold">Admissions</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={label}
              to={`/dashboard/${path}`}
              className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-700 transition-colors ${
                location.pathname === `/dashboard/${path}` ? "bg-blue-700" : ""
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">{currentLabel}</h1>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded"><Bell size={18} /></button>
            <button className="p-2 hover:bg-gray-100 rounded"><Mail size={18} /></button>
            <button className="p-2 hover:bg-gray-100 rounded"><Menu size={18} /></button>
          </div>
        </header>

        <div className="flex-1 p-6">
          <Routes>
            <Route path=""             element={<DashboardHome students={students} />} />
            <Route path="applications" element={<ApplicationsPage students={students} />} />
            <Route path="candidates/:id" element={<CandidateProfilePage students={students} />} />
            <Route path="candidates"   element={<CandidatesPage students={students} />} />
            <Route path="reports"      element={<ReportsPage students={students} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}