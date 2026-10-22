"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { fetchDashboard, type DashboardData } from "@/lib/dashboard";

function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await fetchDashboard({
        from: from || undefined,
        to: to || undefined,
      });

      setData(result);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Unable to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const clearFilters = () => {
    setFrom("");
    setTo("");
  };

  if (loading && !data) {
    return (
      <main className="p-6">
        <p className="text-gray-600">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 text-gray-900 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Doctor Tracker</h1>
            <p className="mt-2 text-gray-600">
              Monitor doctors, patients, and registration trends.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadDashboard()}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">
            Filter patient statistics
          </h2>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <label className="flex flex-1 flex-col gap-2 text-sm">
              From date
              <input
                type="date"
                value={from}
                max={to || undefined}
                onChange={(event) => setFrom(event.target.value)}
                className="rounded-lg border p-2"
              />
            </label>

            <label className="flex flex-1 flex-col gap-2 text-sm">
              To date
              <input
                type="date"
                value={to}
                min={from || undefined}
                onChange={(event) => setTo(event.target.value)}
                className="rounded-lg border p-2"
              />
            </label>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border px-4 py-2 hover:bg-gray-100"
            >
              Clear dates
            </button>
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Date filters apply to patient statistics. Total doctors represents
            all doctors in the system.
          </p>
        </section>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="mt-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {data && (
          <>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                title="Total Doctors"
                value={data.summary.totalDoctors}
                description="Registered doctors"
              />

              <StatCard
                title="Total Patients"
                value={data.summary.totalPatients}
                description="Patients in the selected period"
              />

              <StatCard
                title="Patients Today"
                value={data.summary.patientsToday}
                description="Registrations today"
              />
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
                <h2 className="mb-1 text-lg font-semibold">
                  Patients per Doctor
                </h2>
                <p className="mb-6 text-sm text-gray-500">
                  Number of patients associated with each doctor
                </p>

                {data.patientsByDoctor.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.patientsByDoctor}
                        margin={{ top: 5, right: 10, left: -15, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="doctorName"
                          tick={{ fontSize: 11 }}
                          interval={0}
                          angle={-20}
                          textAnchor="end"
                          height={65}
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar
                          dataKey="patientCount"
                          name="Patients"
                          fill="#2563eb"
                          radius={[5, 5, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
                <h2 className="mb-1 text-lg font-semibold">
                  Patient Registration Trend
                </h2>
                <p className="mb-6 text-sm text-gray-500">
                  Patients registered per day
                </p>

                {data.patientsByDate.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.patientsByDate}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11 }}
                          minTickGap={20}
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="patientCount"
                          name="Patients"
                          stroke="#16a34a"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
              <div className="border-b p-4 sm:p-6">
                <h2 className="text-lg font-semibold">
                  Doctor Patient Summary
                </h2>
              </div>

              {data.patientsByDoctor.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="p-4">Doctor</th>
                        <th className="p-4">Specialization</th>
                        <th className="p-4">Patients</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.patientsByDoctor.map((doctor) => (
                        <tr
                          key={doctor.doctorId}
                          className="border-t hover:bg-gray-50"
                        >
                          <td className="p-4 font-medium">
                            {doctor.doctorName}
                          </td>
                          <td className="p-4">{doctor.specialization}</td>
                          <td className="p-4">{doctor.patientCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <article className="rounded-xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-3 text-3xl font-bold">{value.toLocaleString()}</p>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="flex h-40 items-center justify-center text-sm text-gray-500">
      No patient data available for this period.
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
