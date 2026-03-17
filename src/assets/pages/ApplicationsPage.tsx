import CandidateTable from '../components/CandidateTable';

export default function ApplicationsPage() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">All Applications</h2>
        <CandidateTable />
      </div>
    </div>
  );
}