import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, Users, BarChart3, Bell, GraduationCap, ChevronDown,
  Shield, LogOut, Settings, CircleUserRound, BrainCircuit,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { icon: Home, label: "Dashboard", path: "" },
  { icon: Users, label: "Candidates", path: "candidates" },
  { icon: BarChart3, label: "Reports", path: "reports" },
  { icon: BrainCircuit, label: "Taxonomy", path: "taxonomy" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    if (!profileOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const currentLabel =
    navItems.find((item) => `/dashboard/${item.path}` === location.pathname)?.label ?? "Dashboard";

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
            <div className="relative" ref={profileMenuRef}>
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
                    <p className="text-sm font-medium text-gray-800">Admissions Admin</p>
                    <p className="text-xs text-gray-500">admin@college.edu</p>
                  </div>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">
                    <Shield size={16} /> Admin Settings
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">
                    <Settings size={16} /> Preferences
                  </button>
                  <div className="my-2 border-t" />
                  <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-50 text-red-600">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}