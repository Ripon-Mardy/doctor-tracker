"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "../../context/auth-context";

const LoginPage = () => {
  const router = useRouter();
  const { admin, loading, login } = useAuth();

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("123456");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (admin) {
    router.replace("/dashboard");

    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Redirecting...</p>
      </main>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Unable to login");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Doctor Tracker
            </h1>

            <p className="mt-2 text-slate-500">Admin Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
