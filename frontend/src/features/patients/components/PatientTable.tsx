import Link from "next/link";
import { CalendarDays, Pencil, Phone, Stethoscope, Trash2 } from "lucide-react";

import type { Patient } from "@/types/patient";

interface PatientTableProps {
  patients: Patient[];
  isLoading?: boolean;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// the doctor can be missing if it was deleted after the patient was added
function DoctorLink({ patient }: { patient: Patient }) {
  if (!patient.doctor) return <span className="text-gray-400">Unassigned</span>;

  return (
    <Link
      href={`/doctors/${patient.doctor._id}`}
      className="text-gray-700 hover:text-blue-600 hover:underline"
    >
      {patient.doctor.name}
    </Link>
  );
}

export function PatientTable({ patients, isLoading = false, onEdit, onDelete }: PatientTableProps) {
  return (
    <div className={`transition-opacity ${isLoading ? "opacity-60" : ""}`}>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs font-medium tracking-wide text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Gender</th>
              <th className="px-4 py-3">Condition</th>
              <th className="px-4 py-3">Doctor</th>
              <th className="hidden px-4 py-3 lg:table-cell">Added</th>
              <th className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {patients.map((patient) => (
              <tr key={patient._id} className="hover:bg-gray-50">
                <td className="max-w-64 px-4 py-3">
                  <p className="truncate font-medium text-gray-900">{patient.name}</p>
                  <p className="truncate text-xs text-gray-500 tabular-nums">{patient.phone}</p>
                </td>
                <td className="px-4 py-3 text-gray-500 tabular-nums">{patient.age}</td>
                <td className="px-4 py-3 text-gray-500 capitalize">{patient.gender}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs text-amber-700">
                    {patient.condition}
                  </span>
                </td>
                <td className="max-w-48 truncate px-4 py-3">
                  <DoctorLink patient={patient} />
                </td>
                <td className="hidden px-4 py-3 whitespace-nowrap text-gray-500 lg:table-cell">
                  {formatDate(patient.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(patient)}
                      aria-label={`Edit ${patient.name}`}
                      className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(patient)}
                      aria-label={`Delete ${patient.name}`}
                      className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {patients.map((patient) => (
          <article
            key={patient._id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900">{patient.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {patient.age} yrs · {patient.gender}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(patient)}
                  aria-label={`Edit ${patient.name}`}
                  className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(patient)}
                  aria-label={`Delete ${patient.name}`}
                  className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <span className="mt-2 inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-xs text-amber-700">
              {patient.condition}
            </span>

            <div className="mt-3 space-y-1.5 text-sm text-gray-500">
              <p className="flex items-center gap-2 truncate">
                <Stethoscope className="h-3.5 w-3.5 shrink-0" /> <DoctorLink patient={patient} />
              </p>
              <p className="flex items-center gap-2 tabular-nums">
                <Phone className="h-3.5 w-3.5 shrink-0" /> {patient.phone}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 shrink-0" /> {formatDate(patient.createdAt)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function PatientTableSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm" role="status">
      <span className="sr-only">Loading patients</span>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="h-3.5 w-40 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-56 animate-pulse rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}
