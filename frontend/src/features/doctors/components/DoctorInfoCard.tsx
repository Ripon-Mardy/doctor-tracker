import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Building2, CalendarDays, Mail, Pencil, Phone, Trash2 } from "lucide-react";

import type { Doctor } from "@/types/doctor";

import { getInitials } from "./DoctorTable";

interface DoctorInfoCardProps {
  doctor: Doctor;
  onEdit: () => void;
  onDelete: () => void;
}

function InfoItem({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <div className="min-w-0">
        <dt className="text-xs text-gray-500">{label}</dt>
        <dd className="truncate text-sm font-medium text-gray-900">{children}</dd>
      </div>
    </div>
  );
}

export function DoctorInfoCard({ doctor, onEdit, onDelete }: DoctorInfoCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="h-20 bg-gradient-to-r from-blue-100 via-blue-50 to-transparent" aria-hidden />

      <div className="-mt-10 flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div className="flex items-end gap-4">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-50 text-2xl font-semibold text-blue-700 ring-4 ring-white">
            {getInitials(doctor.name)}
          </span>
          <div className="min-w-0 pb-1">
            <h1 className="truncate text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
              {doctor.name}
            </h1>
            <span className="mt-1 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700">
              {doctor.specialization}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:flex-none"
          >
            <Pencil className="h-4 w-4" aria-hidden />
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 sm:flex-none"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Delete
          </button>
        </div>
      </div>

      <dl className="grid gap-4 border-t border-gray-200 px-5 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <InfoItem icon={Building2} label="Hospital">
          {doctor.hospital}
        </InfoItem>
        <InfoItem icon={Mail} label="Email">
          <a href={`mailto:${doctor.email}`} className="hover:text-blue-600 hover:underline">
            {doctor.email}
          </a>
        </InfoItem>
        <InfoItem icon={Phone} label="Phone">
          <a href={`tel:${doctor.phone}`} className="tabular-nums hover:text-blue-600 hover:underline">
            {doctor.phone}
          </a>
        </InfoItem>
        <InfoItem icon={CalendarDays} label="Joined">
          {new Date(doctor.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </InfoItem>
      </dl>
    </div>
  );
}

export function DoctorInfoCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm" role="status">
      <span className="sr-only">Loading doctor</span>
      <div className="h-20 animate-pulse bg-gray-100" />
      <div className="-mt-10 flex items-end gap-4 px-5 pb-5 sm:px-6">
        <div className="h-20 w-20 animate-pulse rounded-full bg-gray-200 ring-4 ring-white" />
        <div className="space-y-2 pb-1">
          <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
      <div className="grid gap-4 border-t border-gray-200 px-5 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
