import { useState } from 'react';
import { FileText } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { students, type Student, type Status } from '../data/Students';

function StatusBadge({ status }: { status: Status }) {
  const variants: Record<Status, string> = {
    "Accepted":  "bg-green-100 text-green-800 border-green-200",
    "In Review": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Pending":   "bg-gray-100 text-gray-700 border-gray-200",
    "Rejected":  "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[status]}`}>
      {status}
    </span>
  );
}

const TABS: { label: string; filter: (s: Student) => boolean }[] = [
  { label: "All",       filter: () => true },
  { label: "Pending",   filter: (s) => s.status === "Pending" },
  { label: "In Review", filter: (s) => s.status === "In Review" },
  { label: "Accepted",  filter: (s) => s.status === "Accepted" },
  { label: "Rejected",  filter: (s) => s.status === "Rejected" },
];

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");

  const visible = students
    .filter(TABS[activeTab].filter)
    .filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.program.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="p-6 space-y-6">

      <div className="flex items-center gap-2">
        <FileText size={24} className="text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-800">Applications</h1>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {(["Pending", "In Review", "Accepted", "Rejected"] as Status[]).map((s) => {
          const count = students.filter((st) => st.status === s).length;
          const colors: Record<Status, string> = {
            Pending:     "border-l-gray-400",
            "In Review": "border-l-yellow-400",
            Accepted:    "border-l-green-500",
            Rejected:    "border-l-red-400",
          };
          return (
            <div key={s} className={`bg-white rounded-lg shadow p-4 border-l-4 ${colors[s]}`}>
              <div className="text-sm text-gray-500">{s}</div>
              <div className="text-3xl font-bold text-gray-800 mt-1">{count}</div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 border-b">
        {TABS.map((tab, i) => {
          const count = students.filter(tab.filter).length;
          const isActive = activeTab === i;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors
                ${isActive
                  ? "bg-white border border-b-white border-gray-200 text-blue-600 -mb-px"
                  : "text-gray-500 hover:text-gray-800"
                }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by name or program…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <span className="text-sm text-gray-500">
            {visible.length} result{visible.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {visible.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-400 py-10">
                    No applications found.
                  </TableCell>
                </TableRow>
              ) : (
                visible.map((s) => (
                  <TableRow key={s.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-gray-500 text-sm">{s.email}</TableCell>
                    <TableCell className="text-gray-600">{s.program}</TableCell>
                    <TableCell>
                      <span className={`font-semibold ${s.gpa >= 3.7 ? "text-green-700" : s.gpa >= 3.0 ? "text-gray-800" : "text-red-600"}`}>
                        {s.gpa.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {new Date(s.appliedDate).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Review</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}