"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ProtectedRoute } from "../../components/auth/protected-route";
import { useAuth } from "../../context/auth-context";

import {
  createPatient,
  deletePatient,
  fetchPatients,
  updatePatient,
  type PatientFilters,
} from "../../lib/patients";

import type {
  Patient,
  PatientFormValues,
  PatientGender,
} from "../../types/patient";

import type { Doctor } from "../../types/doctor";
import { fetchDoctors } from "../../lib/doctors";

const emptyForm: PatientFormValues = {
  name: "",
  age: 0,
  gender: "male",
  phone: "",
  condition: "",
  doctor: "",
};

const initialFilters: PatientFilters = {
  search: "",
  condition: "",
  gender: "",
  doctor: "",
  from: "",
  to: "",
  page: 1,
  limit: 10,
};

function PatientsContent() {
  const router = useRouter();

  const { admin, logout } = useAuth();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [filters, setFilters] = useState<PatientFilters>(initialFilters);

  const [form, setForm] = useState<PatientFormValues>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [notice, setNotice] = useState("");

  const loadDoctors = useCallback(async () => {
    try {
      const result = await fetchDoctors({
        search: "",
        specialization: "",
        hospital: "",
        from: "",
        to: "",
        page: 1,
        limit: 100,
      });

      setDoctors(result.doctors);
    } catch {
      setError("Unable to load doctors");
    }
  }, []);

  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchPatients(filters);

      setPatients(result.patients);

      setTotal(result.pagination.total);

      setTotalPages(result.pagination.totalPages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load patients");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadDoctors();
  }, [loadDoctors]);

  useEffect(() => {
    void loadPatients();
  }, [loadPatients]);

  function changeFilter(key: keyof PatientFilters, value: string | number) {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
      page: 1,
    }));
  }

  function openCreateForm() {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
    setError("");
    setNotice("");
  }

  function openEditForm(patient: Patient) {
    setForm({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      condition: patient.condition,
      doctor: patient.doctor._id,
    });

    setEditingId(patient._id);
    setFormOpen(true);

    setError("");
    setNotice("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (editingId) {
        await updatePatient(editingId, form);

        setNotice("Patient updated successfully.");
      } else {
        await createPatient(form);

        setNotice("Patient created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      setFormOpen(false);

      setFilters((previous) => ({
        ...previous,
        page: 1,
      }));

      await loadPatients();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to save patient");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(patient: Patient) {
    const confirmed = window.confirm(`Delete patient ${patient.name}?`);

    if (!confirmed) {
      return;
    }

    setError("");
    setNotice("");

    try {
      await deletePatient(patient._id);

      setNotice("Patient deleted successfully.");

      if (patients.length === 1 && filters.page > 1) {
        setFilters((previous) => ({
          ...previous,
          page: previous.page - 1,
        }));
      } else {
        await loadPatients();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to delete patient");
    }
  }

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <Link href="/dashboard" className="text-xl font-bold">
              Doctor Tracker
            </Link>

            <p className="text-sm text-slate-500">Patient management</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-600 sm:block">
              {admin?.name}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Patients</h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage all registered patients.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            + Add patient
          </button>
        </div>

        {notice && (
          <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {notice}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {formOpen && (
          <section className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit patient" : "Add patient"}
              </h2>

              <button
                onClick={() => setFormOpen(false)}
                className="text-sm text-slate-500"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>

                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border px-3 py-2.5"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Age</label>

                <input
                  required
                  type="number"
                  min="0"
                  max="150"
                  value={form.age}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      age: Number(event.target.value),
                    }))
                  }
                  className="w-full rounded-lg border px-3 py-2.5"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Gender</label>

                <select
                  value={form.gender}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      gender: event.target.value as PatientGender,
                    }))
                  }
                  className="w-full rounded-lg border px-3 py-2.5"
                >
                  <option value="male">Male</option>

                  <option value="female">Female</option>

                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Phone</label>

                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      phone: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border px-3 py-2.5"
                  placeholder="+8801700000000"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Condition
                </label>

                <input
                  required
                  value={form.condition}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      condition: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border px-3 py-2.5"
                  placeholder="Hypertension"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Doctor</label>

                <select
                  required
                  value={form.doctor}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      doctor: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border px-3 py-2.5"
                >
                  <option value="">Select doctor</option>

                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} — {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Create patient"}
                </button>

                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="rounded-lg border px-5 py-2.5 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="mb-5 rounded-xl border bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Search</label>

              <input
                type="search"
                value={filters.search}
                onChange={(event) => changeFilter("search", event.target.value)}
                placeholder="Name, phone, condition..."
                className="w-full rounded-lg border px-3 py-2.5"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Condition
              </label>

              <input
                value={filters.condition}
                onChange={(event) =>
                  changeFilter("condition", event.target.value)
                }
                placeholder="e.g. Diabetes"
                className="w-full rounded-lg border px-3 py-2.5"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Doctor</label>

              <select
                value={filters.doctor}
                onChange={(event) => changeFilter("doctor", event.target.value)}
                className="w-full rounded-lg border px-3 py-2.5"
              >
                <option value="">All doctors</option>

                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Gender</label>

              <select
                value={filters.gender}
                onChange={(event) => changeFilter("gender", event.target.value)}
                className="w-full rounded-lg border px-3 py-2.5"
              >
                <option value="">All</option>

                <option value="male">Male</option>

                <option value="female">Female</option>

                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">From</label>

              <input
                type="date"
                value={filters.from}
                onChange={(event) => changeFilter("from", event.target.value)}
                className="w-full rounded-lg border px-3 py-2.5"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">To</label>

              <input
                type="date"
                value={filters.to}
                onChange={(event) => changeFilter("to", event.target.value)}
                className="w-full rounded-lg border px-3 py-2.5"
              />
            </div>

            <div>
              <button
                onClick={() =>
                  setFilters({
                    ...initialFilters,
                  })
                }
                className="w-full rounded-lg border px-4 py-2.5 text-sm"
              >
                Clear filters
              </button>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b px-5 py-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Patient directory</h2>

              <span className="text-sm text-slate-500">{total} patients</span>
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading patients...
            </div>
          ) : patients.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No patients found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3">Patient</th>

                    <th className="px-5 py-3">Age / Gender</th>

                    <th className="px-5 py-3">Condition</th>

                    <th className="px-5 py-3">Doctor</th>

                    <th className="px-5 py-3">Added</th>

                    <th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {patients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-medium">{patient.name}</p>

                        <p className="text-xs text-slate-500">
                          {patient.phone}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {patient.age} / {patient.gender}
                      </td>

                      <td className="px-5 py-4">{patient.condition}</td>

                      <td className="px-5 py-4">
                        <p className="font-medium">{patient.doctor.name}</p>

                        <p className="text-xs text-slate-500">
                          {patient.doctor.specialization}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEditForm(patient)}
                            className="font-medium text-blue-700"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => void handleDelete(patient)}
                            className="font-medium text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between border-t px-5 py-4">
            <p className="text-sm text-slate-500">
              Page {filters.page} of {Math.max(totalPages, 1)}
            </p>

            <div className="flex gap-2">
              <button
                disabled={filters.page <= 1 || loading}
                onClick={() =>
                  setFilters((previous) => ({
                    ...previous,
                    page: previous.page - 1,
                  }))
                }
                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>

              <button
                disabled={filters.page >= totalPages || loading}
                onClick={() =>
                  setFilters((previous) => ({
                    ...previous,
                    page: previous.page + 1,
                  }))
                }
                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default function PatientsPage() {
  return (
    <ProtectedRoute>
      <PatientsContent />
    </ProtectedRoute>
  );
}
