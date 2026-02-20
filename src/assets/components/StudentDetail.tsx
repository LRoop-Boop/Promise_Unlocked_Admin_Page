import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, Award, FileText, GraduationCap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PassportStamp {
  id: number;
  name: string;
  category: "Technical" | "Leadership" | "Communication" | "Research" | "Community";
  earnedDate: string;
  description: string;
  evidence: string;  // What they submitted to earn it
}

interface StudentDetail {
  id: number;
  name: string;
  email: string;
  phone: string;
  program: string;
  gpa: number;
  status: "Pending" | "In Review" | "Accepted" | "Rejected";
  appliedDate: string;
  address: string;
  birthDate: string;
  expectedGraduation: string;
  stamps: PassportStamp[];
}

interface StudentDetailModalProps {
  student: StudentDetail;
  onClose: () => void;
}

function StampBadge({ stamp }: { stamp: PassportStamp }) {
  const categoryColors = {
    Technical: "bg-blue-100 border-blue-300 text-blue-700",
    Leadership: "bg-purple-100 border-purple-300 text-purple-700",
    Communication: "bg-green-100 border-green-300 text-green-700",
    Research: "bg-orange-100 border-orange-300 text-orange-700",
    Community: "bg-pink-100 border-pink-300 text-pink-700",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${categoryColors[stamp.category]} transition-all hover:scale-105 cursor-pointer`}
      title={stamp.description}
    >
      <Award size={32} strokeWidth={2} />
      <span className="text-xs font-semibold mt-2 text-center">{stamp.name}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants = {
    Accepted: "bg-green-100 text-green-800 border-green-200",
    "In Review": "bg-yellow-100 text-yellow-800 border-yellow-200",
    Pending: "bg-gray-100 text-gray-700 border-gray-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
        variants[status as keyof typeof variants] ?? variants.Pending
      }`}
    >
      {status}
    </span>
  );
}

export default function StudentDetailModal({ student, onClose }: StudentDetailModalProps) {
  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <GraduationCap className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                <p className="text-sm text-gray-600">{student.program}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={student.status} />
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Basic Info Section */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-gray-600" />
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-600 font-medium">Email</div>
                    <div className="text-sm text-gray-900">{student.email}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-600 font-medium">Phone</div>
                    <div className="text-sm text-gray-900">{student.phone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-600 font-medium">Address</div>
                    <div className="text-sm text-gray-900">{student.address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-600 font-medium">Birth Date</div>
                    <div className="text-sm text-gray-900">{student.birthDate}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <GraduationCap size={18} className="text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-600 font-medium">Expected Graduation</div>
                    <div className="text-sm text-gray-900">{student.expectedGraduation}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award size={18} className="text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-600 font-medium">GPA</div>
                    <div className="text-sm font-semibold text-gray-900">{student.gpa.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Passport Stamps - Visual Grid */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Award size={20} className="text-gray-600" />
                Passport Stamps ({student.stamps.length})
              </h3>
              {student.stamps.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                  No stamps earned yet.
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-4">
                  {student.stamps.map((stamp) => (
                    <StampBadge key={stamp.id} stamp={stamp} />
                  ))}
                </div>
              )}
            </section>

            {/* Stamps Details Table */}
            {student.stamps.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Stamp Details</h3>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Stamp Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date Earned</TableHead>
                        <TableHead>Evidence Submitted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.stamps.map((stamp) => (
                        <TableRow key={stamp.id}>
                          <TableCell className="font-medium">{stamp.name}</TableCell>
                          <TableCell>
                            <span className="text-sm px-2 py-1 rounded bg-gray-100 text-gray-700">
                              {stamp.category}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {new Date(stamp.earnedDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600 max-w-md truncate">
                            {stamp.evidence}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>
            )}
          </div>

          <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>Download Application</Button>
          </div>
        </div>
      </div>
    </>
  );
}