import { type Participant } from '../data/Students';
import CandidateTable from '../components/CandidateTable';

interface ApplicationsPageProps {
  students: Participant[];
}

export default function ApplicationsPage({ students }: ApplicationsPageProps) {

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Applications</h2>
        <CandidateTable students={students}/>
      </div>
    </div>
  );
}