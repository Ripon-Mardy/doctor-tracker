import { apiRequest } from "./api";

import type {
  Patient,
  PatientFormValues,
  PatientListResponse,
  PatientResponse,
} from "../types/patient";

export interface PatientFilters {
  search: string;
  condition: string;
  gender: string;
  doctor: string;
  from: string;
  to: string;
  page: number;
  limit: number;
}

export async function fetchPatients(
  filters: PatientFilters,
): Promise<PatientListResponse> {
  const params = new URLSearchParams();

  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.condition.trim()) {
    params.set("condition", filters.condition.trim());
  }

  if (filters.gender) {
    params.set("gender", filters.gender);
  }

  if (filters.doctor) {
    params.set("doctor", filters.doctor);
  }

  if (filters.from) {
    params.set("from", filters.from);
  }

  if (filters.to) {
    params.set("to", filters.to);
  }

  return apiRequest<PatientListResponse>(`/patients?${params.toString()}`);
}

export async function createPatient(
  values: PatientFormValues,
): Promise<Patient> {
  const response = await apiRequest<PatientResponse>("/patients", {
    method: "POST",
    body: JSON.stringify(values),
  });

  return response.patient;
}

export async function updatePatient(
  id: string,
  values: PatientFormValues,
): Promise<Patient> {
  const response = await apiRequest<PatientResponse>(
    `/patients/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(values),
    },
  );

  return response.patient;
}

export async function deletePatient(id: string): Promise<void> {
  await apiRequest<{
    success: boolean;
    message: string;
  }>(`/patients/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
