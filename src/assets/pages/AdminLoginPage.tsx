import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">

        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-full mb-3">
            <GraduationCap size={28} />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Admissions Login
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to access the dashboard
          </p>
        </div>

        <div className="space-y-4">

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@university.edu"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
          >
            Sign In
          </button>

          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            onClick={handleLogin}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded transition-colors"
          >
            Continue with University SSO
          </button>

        </div>
      </div>
    </div>
  );
}