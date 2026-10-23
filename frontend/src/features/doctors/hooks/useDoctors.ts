"use client";

import { useCallback, useEffect, useState } from "react";

import { fetchDoctors, type DoctorFilters } from "@/lib/doctors";
import type { DoctorListResponse } from "@/types/doctor";

interface DoctorsResult {
  key: string;
  data: DoctorListResponse | null;
  error: string | null;
}

export function useDoctors(filters: DoctorFilters) {
  const [reloadCount, setReloadCount] = useState(0);
  const [result, setResult] = useState<DoctorsResult | null>(null);

  // Same trick as the dashboard: any filter change or reload gives a new key
  const requestKey = `${JSON.stringify(filters)}|${reloadCount}`;

  useEffect(() => {
    let ignore = false;

    fetchDoctors(filters)
      .then((data) => {
        if (!ignore) setResult({ key: requestKey, data, error: null });
      })
      .catch((err: unknown) => {
        if (ignore) return;
        const message = err instanceof Error ? err.message : "Failed to load doctors";
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
    // keep showing the old rows while the next page loads, so the table doesn't jump
    data: result?.data ?? null,
    error: isLoading ? null : result.error,
    isLoading,
    refetch,
  };
}
