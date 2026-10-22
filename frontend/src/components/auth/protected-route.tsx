"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "../../context/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { admin, loading } = useAuth();

  useEffect(() => {
    if (!loading && !admin) {
      router.replace("/");
    }
  }, [admin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return <>{children}</>;
}
