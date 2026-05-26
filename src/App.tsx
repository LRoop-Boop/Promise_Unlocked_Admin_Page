import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import RoleSelectPage from './assets/pages/RoleSelectPage';
import Login from './assets/pages/AdminLoginPage';
import AdminDashboard from './assets/pages/AdminDashboard';
import {
  participants as initialStudents,
  type Participant,
} from "./assets/data/Students";

export default function App() {
  const [students] = useState<Participant[]>(initialStudents);

  return (
    <Routes>
      <Route path="/" element={<RoleSelectPage />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard/*"
        element={<AdminDashboard students={students} />}
      />
    </Routes>
  );
}