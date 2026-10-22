"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ProtectedRoute } from "../../components/auth/protected-route";
import { useAuth } from "../../context/auth-context";
import {
  createDoctor,
  deleteDoctor,
  fetchDoctors,
  updateDoctor,
  type DoctorFilters,
} from "../../lib/doctors";

import type { Doctor, DoctorFormValues } from "../../types/doctor";

const emptyForm: DoctorFormValues = {
  name: "",
  specialization: "",
  hospital: "",
  phone: "",
  email: "",
};

const initialFilters: DoctorFilters = {
  search: "",
  specialization: "",
  hospital: "",
  from: "",
  to: "",
  page: 1,
  limit: 10,
};

function DoctorsContent() {
  const router = useRouter();
  const { admin, logout } = useAuth();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filters, setFilters] = useState<DoctorFilters>(initialFilters);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [form, setForm] = useState<DoctorFormValues>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchDoctors(filters);

      setDoctors(result.doctors);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load doctors");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadDoctors();
  }, [loadDoctors]);

  function changeFilter(key: keyof DoctorFilters, value: string | number) {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
      page: 1,
    }));
  }

  function openCreateForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  function openEditForm(doctor: Doctor) {
    setForm({
      name: doctor.name,
      specialization: doctor.specialization,
      hospital: doctor.hospital,
      phone: doctor.phone,
      email: doctor.email,
    });

    setEditingId(doctor._id);
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (editingId) {
        await updateDoctor(editingId, form);
        setNotice("Doctor updated successfully.");
      } else {
        await createDoctor(form);
        setNotice("Doctor created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      setFormOpen(false);

      // Return to page one so the newly created record is visible.
      setFilters((previous) => ({
        ...previous,
        page: 1,
      }));

      // Reload immediately as well.
      await loadDoctors();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to save doctor");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(doctor: Doctor) {
    const confirmed = window.confirm(
      `Delete Dr. ${doctor.name}? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await deleteDoctor(doctor._id);
      setNotice("Doctor deleted successfully.");

      // If the last row on a page is removed, go back one page.
      if (doctors.length === 1 && filters.page > 1) {
        setFilters((previous) => ({
          ...previous,
          page: previous.page - 1,
        }));
      } else {
        await loadDoctors();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to delete doctor");
    }
  }

  async function handleLogout() {
    try {
      await logout();
      router.replace("/");
    } catch {
      setError("Unable to log out. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <Link
              href="/dashboard"
              className="text-xl font-bold text-slate-900"
            >
              Doctor Tracker
            </Link>
            <p className="text-sm text-slate-500">Doctor management</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:inline">
              {admin?.name}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Doctors</h1>
            <p className="mt-1 text-sm text-slate-500">
              Add, search, update and manage doctors.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            + Add doctor
          </button>
        </div>

        {notice && (
          <div
            role="status"
            className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
          >
            {notice}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {formOpen && (
          <section className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? "Edit doctor" : "Add a doctor"}
              </h2>

              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="text-sm text-slate-500 hover:text-slate-900"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="doctor-name"
                  className="mb-1 block text-sm font-medium"
                >
                  Full name
                </label>
                <input
                  id="doctor-name"
                  required
                  minLength={2}
                  maxLength={100}
                  value={form.name}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Dr. Sarah Ahmed"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="doctor-specialization"
                  className="mb-1 block text-sm font-medium"
                >
                  Specialization
                </label>
                <input
                  id="doctor-specialization"
                  required
                  maxLength={100}
                  value={form.specialization}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      specialization: event.target.value,
                    }))
                  }
                  placeholder="Cardiology"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="doctor-hospital"
                  className="mb-1 block text-sm font-medium"
                >
                  Hospital
                </label>
                <input
                  id="doctor-hospital"
                  required
                  maxLength={150}
                  value={form.hospital}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      hospital: event.target.value,
                    }))
                  }
                  placeholder="City Medical College Hospital"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="doctor-phone"
                  className="mb-1 block text-sm font-medium"
                >
                  Phone
                </label>
                <input
                  id="doctor-phone"
                  type="tel"
                  required
                  maxLength={30}
                  value={form.phone}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="+8801700000000"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="doctor-email"
                  className="mb-1 block text-sm font-medium"
                >
                  Email
                </label>
                <input
                  id="doctor-email"
                  type="email"
                  required
                  maxLength={254}
                  value={form.email}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }))
                  }
                  placeholder="sarah@example.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-900"
                />
              </div>

              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Create doctor"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForm(emptyForm);
                    setEditingId(null);
                    setFormOpen(false);
                  }}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label
                htmlFor="doctor-search"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Search
              </label>
              <input
                id="doctor-search"
                type="search"
                value={filters.search}
                onChange={(event) => changeFilter("search", event.target.value)}
                placeholder="Name, hospital, specialization..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor="doctor-filter-specialization"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Specialization
              </label>
              <input
                id="doctor-filter-specialization"
                value={filters.specialization}
                onChange={(event) =>
                  changeFilter("specialization", event.target.value)
                }
                placeholder="e.g. Cardiology"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor="doctor-filter-hospital"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Hospital
              </label>
              <input
                id="doctor-filter-hospital"
                value={filters.hospital}
                onChange={(event) =>
                  changeFilter("hospital", event.target.value)
                }
                placeholder="Hospital name"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label
                htmlFor="doctor-from"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Created from
              </label>
              <input
                id="doctor-from"
                type="date"
                value={filters.from}
                onChange={(event) => changeFilter("from", event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
              />
            </div>

            <div>
              <label
                htmlFor="doctor-to"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Created to
              </label>
              <input
                id="doctor-to"
                type="date"
                value={filters.to}
                onChange={(event) => changeFilter("to", event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    ...initialFilters,
                    limit: filters.limit,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
              >
                Clear filters
              </button>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Doctor directory</h2>
            <p className="text-sm text-slate-500">
              {total} {total === 1 ? "doctor" : "doctors"}
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading doctors...
            </div>
          ) : doctors.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-medium text-slate-800">No doctors found</p>
              <p className="mt-1 text-sm text-slate-500">
                Add a doctor or adjust your search filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-3 font-medium">Doctor</th>
                    <th className="px-5 py-3 font-medium">Specialization</th>
                    <th className="px-5 py-3 font-medium">Hospital</th>
                    <th className="px-5 py-3 font-medium">Contact</th>
                    <th className="px-5 py-3 font-medium">Added</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {doctors.map((doctor) => (
                    <tr key={doctor._id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {doctor.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {doctor.email}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {doctor.specialization}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {doctor.hospital}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {doctor.phone}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {new Date(doctor.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => openEditForm(doctor)}
                            className="font-medium text-blue-700 hover:underline"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleDelete(doctor)}
                            className="font-medium text-red-700 hover:underline"
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

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
            <p className="text-sm text-slate-500">
              Page {filters.page} of {Math.max(totalPages, 1)}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={filters.page <= 1 || loading}
                onClick={() =>
                  setFilters((previous) => ({
                    ...previous,
                    page: previous.page - 1,
                  }))
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={filters.page >= totalPages || loading}
                onClick={() =>
                  setFilters((previous) => ({
                    ...previous,
                    page: previous.page + 1,
                  }))
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-40"
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

export default function DoctorsPage() {
  return (
    <ProtectedRoute>
      <DoctorsContent />
    </ProtectedRoute>
  );
}
