"use client";

import { Search, X } from "lucide-react";

import { DateRangePicker } from "@/components/shared/DateRangePicker";

interface DoctorFiltersProps {
  search: string;
  specialization: string;
  hospital: string;
  from: string;
  to: string;
  onSearchChange: (value: string) => void;
  onSpecializationChange: (value: string) => void;
  onHospitalChange: (value: string) => void;
  onDateChange: (from: string, to: string) => void;
  onClear: () => void;
}

export function DoctorFilters({
  search,
  specialization,
  hospital,
  from,
  to,
  onSearchChange,
  onSpecializationChange,
  onHospitalChange,
  onDateChange,
  onClear,
}: DoctorFiltersProps) {
  const hasFilters = Boolean(search || specialization || hospital || from || to);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search name, email, hospital…"
          aria-label="Search doctors"
          className="h-9 w-full rounded-lg border border-gray-200 pr-3 pl-9 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:flex">
        <input
          value={specialization}
          onChange={(e) => onSpecializationChange(e.target.value)}
          placeholder="Specialization"
          aria-label="Filter by specialization"
          className="h-9 rounded-lg border border-gray-200 px-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:w-40"
        />
        <input
          value={hospital}
          onChange={(e) => onHospitalChange(e.target.value)}
          placeholder="Hospital"
          aria-label="Filter by hospital"
          className="h-9 rounded-lg border border-gray-200 px-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:w-40"
        />
        <DateRangePicker
          label="Date added"
          placeholder="Date added"
          align="end"
          from={from || null}
          to={to || null}
          onChange={(newFrom, newTo) => onDateChange(newFrom ?? "", newTo ?? "")}
        />
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-9 items-center justify-center gap-1 rounded-lg px-3 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          <X className="h-4 w-4" aria-hidden />
          Clear
        </button>
      )}
    </div>
  );
}
