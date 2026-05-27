import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StudentDetailModal from "./StudentDetail";
import { type Participant } from "../data/Students";

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

interface CandidateTableProps {
  students: Participant[];
  filter?: (p: Participant) => boolean;
}

export default function CandidateTable({ students, filter }: CandidateTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"displayName" | "lastActiveAt" | "createdAt" | "skillPassport">("lastActiveAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Participant | null>(null);

  const base = filter ? students.filter(filter) : students;

  const filtered = base.filter((p) => {
    const name = (p.displayName ?? p.email).toLowerCase();
    return name.includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
  });

  const sorted = [...filtered].sort((a, b) => {
    let valA: number | string;
    let valB: number | string;

    if (sortField === "skillPassport") {
      valA = a.skillPassport.length;
      valB = b.skillPassport.length;
    } else if (sortField === "displayName") {
      valA = (a.displayName ?? a.email).toLowerCase();
      valB = (b.displayName ?? b.email).toLowerCase();
    } else {
      valA = a[sortField];
      valB = b[sortField];
    }

    const cmp =
      typeof valA === "string" && typeof valB === "string"
        ? valA.localeCompare(valB)
        : (valA as number) - (valB as number);

    return sortDir === "asc" ? cmp : -cmp;
  });

  function handleSort(field: string) {
    const f = field as typeof sortField;
    if (f === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(f);
      setSortDir("asc");
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by name or email…"
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
                <SortableHeader label="Name"        field="displayName"   sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <TableHead>Email</TableHead>
                <SortableHeader label="Joined"      field="createdAt"     sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Last Active" field="lastActiveAt"  sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Skill Areas" field="skillPassport" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-10">
                    No participants found.
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((p) => (
                  <TableRow key={p.uid} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">
                      {p.displayName ?? <span className="text-gray-400 italic">No name</span>}
                    </TableCell>
                    <TableCell className="text-gray-600">{p.email}</TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(p.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(p.lastActiveAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-blue-700">
                        {p.skillPassport.length}
                      </span>
                      <span className="text-gray-400 text-xs ml-1">
                        {p.skillPassport.length === 1 ? "area" : "areas"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelected(p)}>
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

      {selected && (
        <StudentDetailModal participant={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}