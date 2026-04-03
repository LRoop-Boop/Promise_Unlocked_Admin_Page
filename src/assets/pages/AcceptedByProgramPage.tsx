import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, GraduationCap } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StudentDetailModal from "../components/StudentDetail";
import { type Student } from "../data/Students";


function GpaBadge({ gpa }: { gpa: number }) {
  const color =
    gpa >= 3.7 ? "text-green-700 bg-green-50 border-green-200" :
    gpa >= 3.0 ? "text-gray-700 bg-gray-50 border-gray-200" :
                 "text-red-600 bg-red-50 border-red-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${color}`}>
      {gpa.toFixed(1)}
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
  const Icon = isActive ? (sortDir === "asc" ? ChevronUp : ChevronDown) : ChevronsUpDown;
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


interface ProgramSectionProps {
  program: string;
  students: Student[];
  onView: (student: Student) => void;
}

function ProgramSection({ program, students, onView }: ProgramSectionProps) {
  const [open, setOpen]       = useState(true);
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir]     = useState("asc");

  const sorted = [...students].sort((a, b) => {
    const valA = a[sortField as keyof Student];
    const valB = b[sortField as keyof Student];
    const cmp =
      typeof valA === "string" && typeof valB === "string"
        ? valA.localeCompare(valB)
        : (valA as number) - (valB as number);
    return sortDir === "asc" ? cmp : -cmp;
  });

  function handleSort(field: string) {
    if (field === sortField) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <GraduationCap size={18} className="text-blue-600" />
          <span className="text-base font-semibold text-gray-800">{program}</span>
          <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
            {students.length} accepted
          </span>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>

      {open && (
        <div className="border-t">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <SortableHeader label="Name"         field="name"        sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="GPA"          field="gpa"         sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Applied Date" field="appliedDate" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <TableHead>Email</TableHead>
                <TableHead>Expected Grad.</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((student) => (
                <TableRow key={student.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-900">{student.name}</TableCell>
                  <TableCell><GpaBadge gpa={student.gpa} /></TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(student.appliedDate).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">{student.email}</TableCell>
                  <TableCell className="text-gray-600">{student.expectedGraduation}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => onView(student)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}


interface AcceptedByProgramPageProps {
  students: Student[];
}

export default function AcceptedByProgramPage({ students }: AcceptedByProgramPageProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const accepted = students.filter((s) => s.status === "Accepted");

  const byProgram = accepted.reduce<Record<string, Student[]>>((acc, s) => {
    (acc[s.program] ??= []).push(s);
    return acc;
  }, {});

  const programs = Object.keys(byProgram).sort();

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500">
          {accepted.length} accepted student{accepted.length !== 1 ? "s" : ""} across{" "}
          {programs.length} program{programs.length !== 1 ? "s" : ""}
        </p>
      </div>

      {programs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <GraduationCap size={40} className="mb-3 opacity-30" />
          <p className="text-lg font-medium">No accepted students yet.</p>
        </div>
      ) : (
        programs.map((program) => (
          <ProgramSection
            key={program}
            program={program}
            students={byProgram[program]}
            onView={setSelectedStudent}
          />
        ))
      )}

      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}