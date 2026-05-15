import { useNavigate } from "react-router-dom";

export default function RoleSelectPage() {
  const navigate = useNavigate();

  const goToLogin = (role: string) => {
    localStorage.setItem("role", role);
    localStorage.removeItem("view");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">

        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 text-white p-3 rounded-full mb-3"></div>
          <h1 className="text-2xl font-semibold text-gray-800">Promise Unlocked Admissions Portal</h1>
          <p className="text-sm text-gray-500 mt-1 text-center">Select your role to continue</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
      </div>
    </div>
  );
}