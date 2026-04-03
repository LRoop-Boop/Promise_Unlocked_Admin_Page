import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

export default function RoleSelectPage() {
  const navigate = useNavigate();

  // Top buttons: go to login, set role only
  const goToLogin = (role: string) => {
    localStorage.setItem("role", role);
    localStorage.removeItem("view"); // clear any previous view
    navigate("/login");
  };

  // Bottom buttons: go directly to dashboard, set role + view
  const goToDashboard = (role: string, view: string | null = null) => {
    localStorage.setItem("role", role);
    if (view) {
      localStorage.setItem("view", view);
    } else {
      localStorage.removeItem("view");
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">

        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 text-white p-3 rounded-full mb-3"></div>
          <h1 className="text-2xl font-semibold text-gray-800">Admissions Portal</h1>
          <p className="text-sm text-gray-500 mt-1 text-center">Select your role to continue</p>
        </div>

        {/* Top Buttons: go to login */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => goToLogin("admissions")}
            className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 text-left"
          >
            Admissions Officer
          </button>
          <button
            onClick={() => goToLogin("counselor")}
            className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50 text-left"
          >
            High School Counselor
          </button>
        </div>

        {/* Bottom Buttons: go straight to dashboard */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => goToDashboard("dev", null)}
            className="border border-gray-300 rounded-lg p-3 hover:bg-gray-50 flex items-center justify-between"
          >
            Full Cohort <Users size={16} />
          </button>
          <button
            onClick={() => goToDashboard("admissions", "cs")}
            className="border border-gray-300 rounded-lg p-3 hover:bg-gray-50 flex items-center justify-between"
          >
            CS Reviewer <Users size={16} />
          </button>
          <button
            onClick={() => goToDashboard("counselor", "allendale")}
            className="border border-gray-300 rounded-lg p-3 hover:bg-gray-50 flex items-center justify-between"
          >
            Hometown Counselor <Users size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}