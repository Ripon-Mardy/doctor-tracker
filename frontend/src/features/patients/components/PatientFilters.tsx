"use client";

import { Search, X } from "lucide-react";

import { DateRangePicker } from "@/components/shared/DateRangePicker";
import type { Doctor } from "@/types/doctor";

interface PatientFiltersProps {
  search: string;
  condition: string;
  gender: string;
  doctor: string;
  from: string;
  to: string;
  doctors: Doctor[];
  onSearchChange: (value: string) => void;
  onConditionChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onDoctorChange: (value: string) => void;
  onDateChange: (from: string, to: string) => void;
  onClear: () => void;
}

const inputClass =
  "h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export function PatientFilters({
  search,
  condition,
  gender,
  doctor,
  from,
  to,
  doctors,
  onSearchChange,
  onConditionChange,
  onGenderChange,
  onDoctorChange,
  onDateChange,
  onClear,
}: PatientFiltersProps) {
  const hasFilters = Boolean(search || condition || gender || doctor || from || to);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm xl:flex-row xl:items-center">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search name, phone, condition…"
          aria-label="Search patients"
          className={`${inputClass} w-full pl-9`}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:flex">
        <input
          value={condition}
          onChange={(e) => onConditionChange(e.target.value)}
          placeholder="Condition"
          aria-label="Filter by condition"
          className={`${inputClass} xl:w-36`}
        />

        <select
          value={gender}
          onChange={(e) => onGenderChange(e.target.value)}
          aria-label="Filter by gender"
          className={`${inputClass} xl:w-32`}
        >
          <option value="">All genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <select
          value={doctor}
          onChange={(e) => onDoctorChange(e.target.value)}
          aria-label="Filter by doctor"
          className={`${inputClass} xl:w-44`}
        >
          <option value="">All doctors</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>

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
