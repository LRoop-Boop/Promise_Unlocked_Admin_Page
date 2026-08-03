import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleSelectPage from './assets/pages/RoleSelectPage';
import Login from './assets/pages/AdminLoginPage';
import AdminDashboard from './assets/pages/AdminDashboard';
import { useParticipants } from './assets/data/Students';
import { DashboardShell } from './components/DashboardShell';
import {
  DashboardHomeSkeleton,
  ReportsSkeleton,
  CandidatesSkeleton,
  TaxonomySkeleton,
  CandidateProfileSkeleton,
} from './components/PageSkeletons';
import { FullPageError } from './components/FullPageError';
import { isAuthError, isNetworkError } from './lib/apiErrors';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function DashboardBodySkeleton() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/dashboard/candidates/')) return <CandidateProfileSkeleton />;
  if (pathname === '/dashboard/candidates') return <CandidatesSkeleton />;
  if (pathname === '/dashboard/reports') return <ReportsSkeleton />;
  if (pathname === '/dashboard/taxonomy') return <TaxonomySkeleton />;
  return <DashboardHomeSkeleton />;
}

function DashboardWrapper() {
  const { token, logout } = useAuth();
  const { participants, loading, error, refetch } = useParticipants(token);

  useEffect(() => {
    if (error && isAuthError(error)) logout();
  }, [error, logout]);

  if (loading || (error && isAuthError(error))) {
    return (
      <DashboardShell>
        <DashboardBodySkeleton />
      </DashboardShell>
    );
  }

  if (error) {
    if (isNetworkError(error)) {
      return <FullPageError variant="offline" onRetry={refetch} />;
    }
    return (
      <FullPageError
        variant="generic"
        message={error instanceof Error ? error.message : undefined}
        onRetry={refetch}
      />
    );
  }

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