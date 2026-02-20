import React from 'react';
import {
  Home,
  FileText,
  Users,
  BarChart3,
  MessageSquare,
  Calendar,
  Settings,
  Bell,
  Mail,
  Menu,
  GraduationCap,
} from 'lucide-react';

import CandidateTable from '../components/CandidateTable';

const navItems = [
  { icon: Home,          label: "Dashboard",    active: true },
  { icon: FileText,      label: "Applications"              },
  { icon: Users,         label: "Candidates"                },
  { icon: BarChart3,     label: "Reports"                   },
  { icon: MessageSquare, label: "Messages"                  },
  { icon: Calendar,      label: "Calendar"                  },
  { icon: Settings,      label: "Settings"                  },
];

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      <aside className="w-64 bg-blue-600 text-white flex flex-col">
        <div className="p-4 flex items-center gap-2 border-b border-blue-500">
          <GraduationCap size={24} />
          <span className="font-semibold text-lg">Admissions Dashboard</span>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map(({ icon: Icon, label, active }) => (
              <li key={label}>
                <a
                  href="#"
                  className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-700 ${active ? "bg-blue-700" : ""}`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">

        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
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

        <div className="p-6">

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">New Applications</div>
              <div className="text-3xl font-bold text-gray-900">34</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">In Review</div>
              <div className="text-3xl font-bold text-gray-900">128</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Accepted</div>
              <div className="text-3xl font-bold text-gray-900">56</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">My Candidates</h2>
          
            <CandidateTable />
          </div>

        </div>
      </div>
    </div>
  );
}