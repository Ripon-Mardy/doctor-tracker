"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LogIn, Stethoscope } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import Loader from "../loader/Loader";

export default function LoginForm() {
  const router = useRouter();

  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return <Loader />;
  }

  // handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <div className="h-10 w-10 rounded-xl bg-gray-900 flex items-center justify-center">
          <Stethoscope className="h-5 w-5 text-white" />
        </div>
        <span className="font-semibold text-gray-900">Doctor Tracker</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
      <p className="text-sm text-gray-500 mt-1 mb-8">
        Welcome back! Please enter your details.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-geta-800 mb-1.5"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-3.5 rounded-lg border border-gray-300 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-800"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <Link
              href="#"
              className="text-xs text-gray-500 hover:text-gray-900"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-3.5 pr-11 rounded-lg border border-gray-300 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full h-11 rounded-lg bg-gray-900 text-white text-sm font-medium flex items-center justify-center gap-2 transition hover:bg-gray-800 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <LogIn className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Demo login info */}
      <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-xs text-gray-600">
        <p className="font-medium text-gray-800 mb-1">Demo account</p>
        <p>Email: admin@example.com</p>
        <p>Password: 123456</p>

        <button
          onClick={() => {
            setEmail("admin@example.com");
            setPassword("123456");
          }}
          className="mt-4 text-white bg-gray-600 px-4 py-2 rounded-4xl cursor-pointer"
        >
          use demo
        </button>
      </div>
    </div>
  );
}
