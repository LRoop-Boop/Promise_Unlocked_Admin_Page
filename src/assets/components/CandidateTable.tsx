import { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StudentDetailModal from './StudentDetail';

type Status = "Accepted" | "In Review" | "Pending" | "Rejected";

interface Student {
  id: number;
  name: string;
  program: string;
  gpa: number;
  status: Status;
  appliedDate: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  expectedGraduation: string;
  stamps: never[];
  [key: string]: unknown; // allows string-indexed access for sorting
}

const students: Student[] = [
  { id: 1,  name: "Priya Nair",       program: "Computer Science",  gpa: 3.9, status: "Accepted",  appliedDate: "2025-01-03", email: "priya.nair@email.com", phone: "(616) 555-0123", address: "Grand Rapids, MI", birthDate: "2003-05-12", expectedGraduation: "May 2026", stamps: [] },
  { id: 2,  name: "Marcus Webb",      program: "Business Admin",    gpa: 3.4, status: "In Review",  appliedDate: "2025-01-08", email: "marcus.webb@email.com", phone: "(616) 555-0234", address: "Allendale, MI", birthDate: "2002-11-08", expectedGraduation: "May 2026", stamps: [] },
  { id: 3,  name: "Leila Ahmadi",     program: "Data Science",      gpa: 3.7, status: "In Review",  appliedDate: "2025-01-10", email: "leila.ahmadi@email.com", phone: "(616) 555-0345", address: "Holland, MI", birthDate: "2003-03-22", expectedGraduation: "May 2026", stamps: [] },
  { id: 4,  name: "Tom Okafor",       program: "Mechanical Eng.",   gpa: 2.9, status: "Pending",    appliedDate: "2025-01-15", email: "tom.okafor@email.com", phone: "(616) 555-0456", address: "Muskegon, MI", birthDate: "2003-07-30", expectedGraduation: "May 2026", stamps: [] },
  { id: 5,  name: "Sophie Chen",      program: "Computer Science",  gpa: 4.0, status: "Accepted",  appliedDate: "2025-01-17", email: "sophie.chen@email.com", phone: "(616) 555-0567", address: "Grand Rapids, MI", birthDate: "2002-09-14", expectedGraduation: "May 2026", stamps: [] },
  { id: 6,  name: "Diego Reyes",      program: "Psychology",        gpa: 3.2, status: "Rejected",  appliedDate: "2025-01-19", email: "diego.reyes@email.com", phone: "(616) 555-0678", address: "Kalamazoo, MI", birthDate: "2003-01-05", expectedGraduation: "May 2026", stamps: [] },
  { id: 7,  name: "Amara Diallo",     program: "Data Science",      gpa: 3.6, status: "In Review",  appliedDate: "2025-01-22", email: "amara.diallo@email.com", phone: "(616) 555-0789", address: "Grand Rapids, MI", birthDate: "2002-12-19", expectedGraduation: "May 2026", stamps: [] },
  { id: 8,  name: "James Harrington", program: "Business Admin",    gpa: 3.1, status: "Pending",    appliedDate: "2025-01-25", email: "james.h@email.com", phone: "(616) 555-0890", address: "Holland, MI", birthDate: "2003-04-27", expectedGraduation: "May 2026", stamps: [] },
  { id: 9,  name: "Yuki Tanaka",      program: "Mechanical Eng.",   gpa: 3.8, status: "Accepted",  appliedDate: "2025-01-28", email: "yuki.tanaka@email.com", phone: "(616) 555-0901", address: "Muskegon, MI", birthDate: "2002-10-11", expectedGraduation: "May 2026", stamps: [] },
  { id: 10, name: "Nina Kowalski",    program: "Psychology",        gpa: 3.5, status: "In Review",  appliedDate: "2025-02-01", email: "nina.k@email.com", phone: "(616) 555-1012", address: "Allendale, MI", birthDate: "2003-06-16", expectedGraduation: "May 2026", stamps: [] },
];

function StatusBadge({ status }: { status: Status }) {
  const variants: Record<Status, string> = {
    "Accepted":  "bg-green-100 text-green-800 border-green-200",
    "In Review": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Pending":   "bg-gray-100 text-gray-700 border-gray-200",
    "Rejected":  "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[status] ?? variants["Pending"]}`}>
      {status}
    </span>
  );
}

interface SortableHeaderProps {
  label: string;
  field: string;
  sortField: string;
  sortDir: string;
  onSort: (field: string) => void;
}

function SortableHeader({ label, field, sortField, sortDir, onSort }: SortableHeaderProps) {
  const isActive = sortField === field;
  const Icon = isActive
    ? sortDir === "asc" ? ChevronUp : ChevronDown
    : ChevronsUpDown;

  return (
    <TableHead
      className="cursor-pointer select-none hover:bg-gray-50 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <Icon size={14} className={isActive ? "text-blue-600" : "text-gray-400"} />
      </div>
    </TableHead>
  );
}

export default function CandidateTable() {
  const [search, setSearch]       = useState("");
  const [sortField, setSortField] = useState("appliedDate");
  const [sortDir, setSortDir]     = useState("desc");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.program.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    const cmp = typeof valA === "string" && typeof valB === "string"
      ? valA.localeCompare(valB)
      : (valA as number) - (valB as number);
    return sortDir === "asc" ? cmp : -cmp;
  });

  function handleSort(field: string) {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by name or program…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <span className="text-sm text-gray-500">
            {sorted.length} result{sorted.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <SortableHeader label="Name"         field="name"        sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Program"      field="program"     sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="GPA"          field="gpa"         sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <TableHead>Status</TableHead>
                <SortableHeader label="Applied Date" field="appliedDate" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-10">
                    No candidates match your search.
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((student) => (
                  <TableRow key={student.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-gray-600">{student.program}</TableCell>
                    <TableCell>
                      <span className={`font-semibold ${student.gpa >= 3.7 ? "text-green-700" : student.gpa >= 3.0 ? "text-gray-800" : "text-red-600"}`}>
                        {student.gpa.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={student.status} /></TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(student.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStudent(student)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </>
  );
}