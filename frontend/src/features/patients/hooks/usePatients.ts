"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchPatients, type PatientFilters } from "@/lib/patients";
import type { PatientListResponse } from "@/types/patient";

interface PatientsResult {
  key: string;
  data: PatientListResponse | null;
  error: string | null;
}

export function usePatients(filters: PatientFilters) {
  const [reloadCount, setReloadCount] = useState(0);
  const [result, setResult] = useState<PatientsResult | null>(null);

  // new key on every filter change or reload, same as useDoctors
  const requestKey = `${JSON.stringify(filters)}|${reloadCount}`;

  useEffect(() => {
    let ignore = false;

    fetchPatients(filters)
      .then((data) => {
        if (!ignore) setResult({ key: requestKey, data, error: null });
      })
      .catch((err: unknown) => {
        if (ignore) return;
        const message = err instanceof Error ? err.message : "Failed to load patients";
        setResult({ key: requestKey, data: null, error: message });
      });

    return () => {
      ignore = true;
    };
    // requestKey already covers every field in filters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey]);

  const refetch = useCallback(() => setReloadCount((count) => count + 1), []);

  const isLoading = result?.key !== requestKey;

  return {
    // keep the old rows on screen while the next page loads
    data: result?.data ?? null,
    error: isLoading ? null : result.error,
    isLoading,
    refetch,
  };
}
