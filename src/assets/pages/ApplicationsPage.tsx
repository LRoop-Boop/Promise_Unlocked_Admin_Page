import { type Student } from '../data/Students';
import CandidateTable from '../components/CandidateTable';

interface ApplicationsPageProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

export default function ApplicationsPage({ students, setStudents }: ApplicationsPageProps) {
  const role = localStorage.getItem("role");
  const view = localStorage.getItem("view");

  let filteredStudents = students;

  if (role === "counselor") {
    filteredStudents = filteredStudents.filter((s) => s.address === "Allendale, MI");
  }

  if (view === "cs") {
    filteredStudents = filteredStudents.filter((s) => s.program === "Computer Science");
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Applications</h2>
        <CandidateTable students={filteredStudents} setStudents={setStudents} />
      </div>
    </div>
  );
}