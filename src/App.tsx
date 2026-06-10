import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleSelectPage from './assets/pages/RoleSelectPage';
import Login from './assets/pages/AdminLoginPage';
import AdminDashboard from './assets/pages/AdminDashboard';
import { participants as mockStudents, type Participant } from './assets/data/Students';
import { apiFetch, adaptParticipant, type ApiParticipant } from './api/client';

// Redirects to /login if not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function DashboardWrapper() {
  const { token } = useAuth();
  const USE_MOCK_DATA = false;
  const [students, setStudents] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      setStudents(mockStudents);
      setLoading(false);
      return;
    }

    if (!token) {
      setStudents(mockStudents);
      setLoading(false);
      return;
    }

    apiFetch<{ participants: ApiParticipant[] }>('/participants', { token: token ?? undefined })
      .then(({ participants }) => setStudents(participants.map(adaptParticipant)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="p-8 text-gray-500">Loading participants...</div>;
  if (error)   return <div className="p-8 text-red-500">Error: {error}</div>;

  return <AdminDashboard students={students} />;
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