import Link from "next/link";
import { Building2, Mail, Pencil, Phone, Trash2 } from "lucide-react";

import type { Doctor } from "@/types/doctor";

interface DoctorTableProps {
  doctors: Doctor[];
  isLoading?: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctor: Doctor) => void;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getInitials(name: string) {
  return name
    .replace(/^dr\.?\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
      {getInitials(name)}
    </span>
  );
}

export function DoctorTable({ doctors, isLoading = false, onEdit, onDelete }: DoctorTableProps) {
  return (
    <div className={`transition-opacity ${isLoading ? "opacity-60" : ""}`}>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs font-medium tracking-wide text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Specialization</th>
              <th className="px-4 py-3">Hospital</th>
              <th className="hidden px-4 py-3 xl:table-cell">Phone</th>
              <th className="hidden px-4 py-3 lg:table-cell">Added</th>
              <th className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {doctors.map((doctor) => (
              <tr key={doctor._id} className="hover:bg-gray-50">
                <td className="max-w-72 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={doctor.name} />
                    <div className="min-w-0">
                      <Link
                        href={`/doctors/${doctor._id}`}
                        className="block truncate font-medium text-gray-900 hover:text-blue-600 hover:underline"
                      >
                        {doctor.name}
                      </Link>
                      <p className="truncate text-xs text-gray-500">{doctor.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700">
                    {doctor.specialization}
                  </span>
                </td>
                <td className="max-w-56 truncate px-4 py-3 text-gray-500">{doctor.hospital}</td>
                <td className="hidden px-4 py-3 whitespace-nowrap text-gray-500 tabular-nums xl:table-cell">
                  {doctor.phone}
                </td>
                <td className="hidden px-4 py-3 whitespace-nowrap text-gray-500 lg:table-cell">
                  {formatDate(doctor.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(doctor)}
                      aria-label={`Edit ${doctor.name}`}
                      className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(doctor)}
                      aria-label={`Delete ${doctor.name}`}
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
        {doctors.map((doctor) => (
          <article
            key={doctor._id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <Avatar name={doctor.name} />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/doctors/${doctor._id}`}
                  className="block truncate font-medium text-gray-900 hover:text-blue-600"
                >
                  {doctor.name}
                </Link>
                <span className="mt-1 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700">
                  {doctor.specialization}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(doctor)}
                  aria-label={`Edit ${doctor.name}`}
                  className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(doctor)}
                  aria-label={`Delete ${doctor.name}`}
                  className="rounded-md p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-3 space-y-1.5 text-sm text-gray-500">
              <p className="flex items-center gap-2 truncate">
                <Building2 className="h-3.5 w-3.5 shrink-0" /> {doctor.hospital}
              </p>
              <p className="flex items-center gap-2 truncate">
                <Mail className="h-3.5 w-3.5 shrink-0" /> {doctor.email}
              </p>
              <p className="flex items-center gap-2 tabular-nums">
                <Phone className="h-3.5 w-3.5 shrink-0" /> {doctor.phone}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function DoctorTableSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm" role="status">
      <span className="sr-only">Loading doctors</span>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-40 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-56 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
