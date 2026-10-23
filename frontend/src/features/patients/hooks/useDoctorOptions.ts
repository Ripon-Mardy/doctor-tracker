"use client";

import { useEffect, useState } from "react";

import { fetchDoctors } from "@/lib/doctors";
import type { Doctor } from "@/types/doctor";

// The backend caps limit at 100, which is plenty for a dropdown
export function useDoctorOptions() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    fetchDoctors({ search: "", specialization: "", hospital: "", from: "", to: "", page: 1, limit: 100 })
      .then((res) => {
        if (!ignore) setDoctors(res.doctors);
      })
      .catch(() => {
        // the dropdown just stays empty, not worth blocking the page for
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { doctors, isLoading };
}
