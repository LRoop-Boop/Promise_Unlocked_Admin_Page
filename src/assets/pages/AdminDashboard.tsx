import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  Users,
  BarChart3,
  Bell,
  GraduationCap,
  ChevronDown,
  Shield,
  LogOut,
  Settings,
  TrendingUp,
  Clock,
  UserCheck,
  CircleUserRound,
} from "lucide-react";

import ApplicationsPage from "./ApplicationsPage";
import ReportsPage from "./ReportsPage";
import CandidatesPage from "./CandidatePage";
import CandidateTable from "../components/CandidateTable";
import { Participant } from "../data/Students";
import CandidateProfilePage from "./CandidateProfilePage";
import { useState } from "react";
import {
  ApplicationsByProgramChart,
} from "../components/ReportsCharts";

interface AdminDashboardProps {
  students: Participant[];
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

function DashboardHome({ students }: { students: Participant[] }) {
  const metrics = {
  total: students.length,
  newProfiles: students.length,
  reviewed: 0,
  mappedSkills: students.reduce(
    (sum, s) => sum + s.skillPassport.length,
    0
  ),
};

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Participants"
          value={metrics.total}
          color="bg-blue-500"
        />

        <StatCard
          icon={Clock}
          label="New Profiles"
          value={metrics.newProfiles}
          color="bg-yellow-500"
        />

        <StatCard
          icon={UserCheck}
          label="Reviewed Profiles"
          value={metrics.reviewed}
          color="bg-purple-500"
        />

        <StatCard
          icon={TrendingUp}
          label="Mapped Skills"
          value={metrics.mappedSkills}
          color="bg-green-500"
        />
      </div>

      <div className="space-y-6">
        <ApplicationsByProgramChart students={students} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck size={18} className="text-yellow-500" />
          <h2 className="text-base font-semibold text-gray-800">
            New Participant Profiles
          </h2>
          <span className="ml-auto text-sm text-gray-400">
            {metrics.newProfiles} profiles
          </span>
        </div>

        <CandidateTable
          students={students}
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
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

          <div className="flex items-center gap-3 relative">
            <button className="relative p-2 hover:bg-gray-100 rounded transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-px h-6 bg-gray-200" />
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 transition-colors"
              >
                <CircleUserRound size={20} />
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium text-gray-800">
                      Admissions Admin
                    </p>
                    <p className="text-xs text-gray-500">
                      admin@college.edu
                    </p>
                  </div>

                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">
                    <Shield size={16} />
                    Admin Settings
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">
                    <Settings size={16} />
                    Preferences
                  </button>
                  <div className="my-2 border-t" />
                  <button onClick={() => navigate("/")} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-50 text-red-600">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
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