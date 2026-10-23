"use client";

import { useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/Pagination";
import { DeletePatientModal } from "@/features/patients/components/DeletePatientModal";
import { PatientFilters } from "@/features/patients/components/PatientFilters";
import { PatientFormModal } from "@/features/patients/components/PatientFormModal";
import { PatientTable, PatientTableSkeleton } from "@/features/patients/components/PatientTable";
import { useDoctorOptions } from "@/features/patients/hooks/useDoctorOptions";
import { usePatients } from "@/features/patients/hooks/usePatients";
import type { Patient } from "@/types/patient";

const PAGE_SIZE = 10;

const PatientsPage = () => {
  // what the user is typing right now
  const [searchInput, setSearchInput] = useState("");
  const [conditionInput, setConditionInput] = useState("");

  // what actually goes to the API (debounced)
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("");

  const [gender, setGender] = useState("");
  const [doctor, setDoctor] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [deleting, setDeleting] = useState<Patient | null>(null);

  const { doctors } = useDoctorOptions();

  // wait a bit after typing so we don't hit the API on every key
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCondition(conditionInput);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, conditionInput]);

  const { data, error, isLoading, refetch } = usePatients({
    search,
    condition,
    gender,
    doctor,
    from,
    to,
    page,
    limit: PAGE_SIZE,
  });

  const patients = data?.patients ?? [];
  const pagination = data?.pagination;

  function handleDeleted() {
    // deleted the only patient on this page, so step back one page
    if (patients.length === 1 && page > 1) {
      setPage(page - 1);
    } else {
      refetch();
    }
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(patient: Patient) {
    setEditing(patient);
    setFormOpen(true);
  }

  function clearFilters() {
    setSearchInput("");
    setConditionInput("");
    setGender("");
    setDoctor("");
    setFrom("");
    setTo("");
    setPage(1);
  }

  const hasFilters = Boolean(search || condition || gender || doctor || from || to);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description={
          pagination
            ? `${pagination.total} ${pagination.total === 1 ? "patient" : "patients"} on record`
            : "Manage patient records"
        }
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add patient
          </button>
        }
      />

      <PatientFilters
        search={searchInput}
        condition={conditionInput}
        gender={gender}
        doctor={doctor}
        from={from}
        to={to}
        doctors={doctors}
        onSearchChange={setSearchInput}
        onConditionChange={setConditionInput}
        onGenderChange={(value) => {
          setGender(value);
          setPage(1);
        }}
        onDoctorChange={(value) => {
          setDoctor(value);
          setPage(1);
        }}
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
        <PatientTableSkeleton />
      ) : patients.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center">
          <Users className="h-8 w-8 text-gray-400" aria-hidden />
          <p className="mt-3 font-medium text-gray-900">
            {hasFilters ? "No patients match your filters" : "No patients yet"}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {hasFilters
              ? "Try a different search or clear the filters."
              : "Add your first patient and assign them to a doctor."}
          </p>
          <button
            type="button"
            onClick={hasFilters ? clearFilters : openCreate}
            className="mt-4 h-9 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {hasFilters ? "Clear filters" : "Add patient"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <PatientTable
            patients={patients}
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
              itemLabel="patients"
            />
          )}
        </div>
      )}

      <PatientFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        patient={editing}
        doctors={doctors}
        onSaved={refetch}
      />

      <DeletePatientModal
        patient={deleting}
        onClose={() => setDeleting(null)}
        onDeleted={handleDeleted}
      />
    </div>
  );
};

export default PatientsPage;
