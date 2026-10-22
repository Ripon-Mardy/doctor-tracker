"use client";

import { useRouter } from "next/navigation";

import { ProtectedRoute } from "../../components/auth/protected-route";
import { useAuth } from "../../context/auth-context";

function DashboardContent() {
  const router = useRouter();
  const { admin, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Doctor Tracker</h1>

            <p className="text-sm text-slate-500">Admin Dashboard</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">
                {admin?.name}
              </p>

              <p className="text-xs text-slate-500">{admin?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>

          <p className="mt-1 text-slate-500">
            Welcome back. Manage your doctors and patients from here.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Doctors</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Patients</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Patients Today</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
