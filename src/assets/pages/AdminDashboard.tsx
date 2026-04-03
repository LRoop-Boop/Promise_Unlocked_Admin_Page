import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Home, FileText, Users, BarChart3, MessageSquare,
  Calendar, Settings, Bell, Mail, Menu, GraduationCap,
} from 'lucide-react';

import PendingCandidateTable from '../components/PendingCandidateTable';
import ApplicationsPage from './ApplicationsPage';
import ReportsPage from './ReportsPage';
import { Student } from '../data/Students';

const navItems = [
  { icon: Home,          label: "Dashboard",    path: "/"             },
  { icon: FileText,      label: "Applications", path: "/applications" },
  { icon: Users,         label: "Candidates",   path: "/candidates"   },
  { icon: BarChart3,     label: "Reports",      path: "/reports"      },
  { icon: MessageSquare, label: "Messages",     path: "/messages"     },
  { icon: Calendar,      label: "Calendar",     path: "/calendar"     },
  { icon: Settings,      label: "Settings",     path: "/settings"     },
];

interface AdminDashboardProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

function DashboardHome({ students }: { students: Student[] }) {
  const metrics = {
    newApplications: students.filter(s => s.status === "Pending").length,
    inReview:        students.filter(s => s.status === "In Review").length,
    accepted:        students.filter(s => s.status === "Accepted").length,
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">New Applications</div>
          <div className="text-3xl font-bold text-gray-900">{metrics.newApplications}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">In Review</div>
          <div className="text-3xl font-bold text-gray-900">{metrics.inReview}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Accepted</div>
          <div className="text-3xl font-bold text-gray-900">{metrics.accepted}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Candidates</h2>
        <PendingCandidateTable students={students} />
      </div>
    </>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-gray-400">
      <GraduationCap size={48} className="mb-4 opacity-30" />
      <p className="text-xl font-medium">{label}</p>
      <p className="text-sm mt-1">This page is coming soon.</p>
    </div>
  );
}

export default function AdminDashboard({ students, setStudents }: AdminDashboardProps) {
  const location = useLocation();
  const currentLabel = navItems.find(item => item.path === location.pathname)?.label ?? "Dashboard";

  return (
    <div className="flex min-h-screen bg-gray-100">

      <aside className="w-64 bg-blue-600 text-white flex flex-col">
        <div className="p-4 flex items-center gap-2 border-b border-blue-500">
          <GraduationCap size={24} />
          <span className="font-semibold text-lg">Admissions Dashboard</span>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map(({ icon: Icon, label, path }) => (
              <li key={label}>
                <Link
                  to={path}
                  className={`flex items-center gap-3 px-4 py-2 rounded w-full text-left hover:bg-blue-700 transition-colors text-white
                    ${location.pathname === path ? "bg-blue-700" : ""}`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">{currentLabel}</h1>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <Mail size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Menu size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/"             element={<div className="p-6"><DashboardHome students={students} /></div>} />
          <Route path="/applications" element={<ApplicationsPage students={students} setStudents={setStudents} />} />
          <Route path="/reports"      element={<ReportsPage students={students} />} />
          <Route path="/candidates"   element={<ComingSoon label="Candidates" />} />
          <Route path="/messages"     element={<ComingSoon label="Messages" />} />
          <Route path="/calendar"     element={<ComingSoon label="Calendar" />} />
          <Route path="/settings"     element={<ComingSoon label="Settings" />} />
        </Routes>

      </div>
    </div>
  );
}