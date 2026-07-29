import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleSelectPage from './assets/pages/RoleSelectPage';
import Login from './assets/pages/AdminLoginPage';
import AdminDashboard from './assets/pages/AdminDashboard';
import { useParticipants } from './assets/data/Students';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function DashboardWrapper() {
  const { token } = useAuth();
  const { participants, loading, error } = useParticipants(token);

  if (loading) return <div className="p-8 text-gray-500">Loading participants...</div>;
  if (error)   return <div className="p-8 text-red-500">Error: {error}</div>;

  return <AdminDashboard students={participants} />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<RoleSelectPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardWrapper />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}