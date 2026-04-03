import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './assets/pages/AdminDashboard';
import { students as initialStudents, Student } from './assets/data/Students';

export default function App() {
  const [students, setStudents] = useState<Student[]>(initialStudents);

  return (
    <Routes>
      {/* Future login/signup routes go here */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
      {/* <Route path="/signup" element={<SignupPage />} /> */}
      <Route path="/*" element={<AdminDashboard students={students} setStudents={setStudents} />} />
    </Routes>
  );
}