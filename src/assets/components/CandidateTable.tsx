import { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StudentDetailModal from './StudentDetail';
import { type Student, type Status } from '../data/Students';

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

interface CandidateTableProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

export default function CandidateTable({ students, setStudents }: CandidateTableProps) {
  const [search, setSearch]       = useState("");
  const [sortField, setSortField] = useState("appliedDate");
  const [sortDir, setSortDir]     = useState("desc");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.program.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortField as keyof Student];
    const valB = b[sortField as keyof Student];
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