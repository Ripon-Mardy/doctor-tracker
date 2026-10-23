"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchDoctor } from "@/lib/doctors";
import type { Doctor } from "@/types/doctor";

interface DoctorResult {
  key: string;
  doctor: Doctor | null;
  error: string | null;
}

export function useDoctor(id: string) {
  const [reloadCount, setReloadCount] = useState(0);
  const [result, setResult] = useState<DoctorResult | null>(null);

  const requestKey = `${id}|${reloadCount}`;

  useEffect(() => {
    let ignore = false;

    fetchDoctor(id)
      .then((doctor) => {
        if (!ignore) setResult({ key: requestKey, doctor, error: null });
      })
      .catch((err: unknown) => {
        if (ignore) return;
        const message = err instanceof Error ? err.message : "Failed to load doctor";
        setResult({ key: requestKey, doctor: null, error: message });
      });

    return () => {
      ignore = true;
    };
  }, [id, requestKey]);

  const refetch = useCallback(() => setReloadCount((count) => count + 1), []);

  const isLoading = result?.key !== requestKey;

  return {
    doctor: result?.doctor ?? null,
    error: isLoading ? null : result.error,
    isLoading,
    refetch,
  };
}
