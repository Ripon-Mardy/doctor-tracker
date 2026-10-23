"use client";

import { useEffect, useState } from "react";
import { Plus, Stethoscope } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/Pagination";
import { DeleteDoctorModal } from "@/features/doctors/components/DeleteDoctorModal";
import { DoctorFilters } from "@/features/doctors/components/DoctorFilters";
import { DoctorFormModal } from "@/features/doctors/components/DoctorFormModal";
import { DoctorTable, DoctorTableSkeleton } from "@/features/doctors/components/DoctorTable";
import { useDoctors } from "@/features/doctors/hooks/useDoctors";
import type { Doctor } from "@/types/doctor";

const PAGE_SIZE = 10;

const DoctorsPage = () => {
  // what the user is typing right now
  const [searchInput, setSearchInput] = useState("");
  const [specializationInput, setSpecializationInput] = useState("");
  const [hospitalInput, setHospitalInput] = useState("");

  // what actually goes to the API (debounced)
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hospital, setHospital] = useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [deleting, setDeleting] = useState<Doctor | null>(null);

  // wait a bit after typing so we don't hit the API on every key
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setSpecialization(specializationInput);
      setHospital(hospitalInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, specializationInput, hospitalInput]);

  const { data, error, isLoading, refetch } = useDoctors({
    search,
    specialization,
    hospital,
    from,
    to,
    page,
    limit: PAGE_SIZE,
  });

  const doctors = data?.doctors ?? [];
  const pagination = data?.pagination;

  function handleDeleted() {
    // deleted the only doctor on this page, so step back one page
    if (doctors.length === 1 && page > 1) {
      setPage(page - 1);
    } else {
      refetch();
    }
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(doctor: Doctor) {
    setEditing(doctor);
    setFormOpen(true);
  }

  function clearFilters() {
    setSearchInput("");
    setSpecializationInput("");
    setHospitalInput("");
    setFrom("");
    setTo("");
    setPage(1);
  }

  const hasFilters = Boolean(search || specialization || hospital || from || to);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctors"
        description={
          pagination
            ? `${pagination.total} ${pagination.total === 1 ? "doctor" : "doctors"} in your directory`
            : "Manage your medical staff"
        }
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add doctor
          </button>
        }
      />

      <DoctorFilters
        search={searchInput}
        specialization={specializationInput}
        hospital={hospitalInput}
        from={from}
        to={to}
        onSearchChange={setSearchInput}
        onSpecializationChange={setSpecializationInput}
        onHospitalChange={setHospitalInput}
        onDateChange={(newFrom, newTo) => {
          setFrom(newFrom);
          setTo(newTo);
          setPage(1);
        }}
        onClear={clearFilters}
      />

      {error ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button type="button" onClick={refetch} className="font-medium underline">
            Try again
          </button>
        </div>
      ) : isLoading && !data ? (
        <DoctorTableSkeleton />
      ) : doctors.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center">
          <Stethoscope className="h-8 w-8 text-gray-400" aria-hidden />
          <p className="mt-3 font-medium text-gray-900">
            {hasFilters ? "No doctors match your filters" : "No doctors yet"}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {hasFilters
              ? "Try a different search or clear the filters."
              : "Add your first doctor to start assigning patients."}
          </p>
          <button
            type="button"
            onClick={hasFilters ? clearFilters : openCreate}
            className="mt-4 h-9 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {hasFilters ? "Clear filters" : "Add doctor"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <DoctorTable
            doctors={doctors}
            isLoading={isLoading}
            onEdit={openEdit}
            onDelete={setDeleting}
          />
          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={setPage}
              itemLabel="doctors"
            />
          )}
        </div>
      )}

      <DoctorFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        doctor={editing}
        onSaved={refetch}
      />

      <DeleteDoctorModal doctor={deleting} onClose={() => setDeleting(null)} onDeleted={handleDeleted} />
    </div>
  );
};

export default DoctorsPage;
