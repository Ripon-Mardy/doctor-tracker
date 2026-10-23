import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getPatientsOverTime, getDashboardStats } from "./api";
import { getDoctorsBySpecialization, getPatientsPerDoctor } from "./api";

import type { Range } from "./types";

export function usePatientsOverTime(range: Range) {
  return useQuery({
    queryKey: ["dashboard", "patients-over-time", range],
    queryFn: () => getPatientsOverTime(range),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
    staleTime: 60_000,
  });
}

export function usePatientsPerDoctor() {
  return useQuery({
    queryKey: ["dashboard", "patients-per-doctor"],
    queryFn: getPatientsPerDoctor,
  });
}

export function useDoctorsBySpecialization() {
  return useQuery({
    queryKey: ["dashboard", "by-specialization"],
    queryFn: getDoctorsBySpecialization,
  });
}
