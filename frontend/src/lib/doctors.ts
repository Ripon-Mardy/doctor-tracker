import { apiRequest } from "./api";

import type {
  Doctor,
  DoctorFormValues,
  DoctorListResponse,
  DoctorResponse,
} from "../types/doctor";

export interface DoctorFilters {
  search: string;
  specialization: string;
  hospital: string;
  from: string;
  to: string;
  page: number;
  limit: number;
}

// fetch doctors function
export const fetchDoctors = (
  filters: DoctorFilters,
): Promise<DoctorListResponse> => {
  const params = new URLSearchParams();

  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.specialization.trim()) {
    params.set("specialization", filters.specialization.trim());
  }

  if (filters.hospital.trim()) {
    params.set("hospital", filters.hospital.trim());
  }

  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);

  return apiRequest<DoctorListResponse>(`/doctors?${params.toString()}`);
};

// create doctor function
export const createDoctor = async (
  values: DoctorFormValues,
): Promise<Doctor> => {
  const response = await apiRequest<DoctorResponse>("/doctors", {
    method: "POST",
    body: JSON.stringify(values),
  });

  return response.doctor;
};

// update doctor function
export const updateDoctor = async (
  id: string,
  values: DoctorFormValues,
): Promise<Doctor> => {
  const response = await apiRequest<DoctorResponse>(
    `/doctors/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(values),
    },
  );

  return response.doctor;
};

// delete doctor function
export const deleteDoctor = async (id: string): Promise<void> => {
  await apiRequest<{ success: boolean; message: string }>(
    `/doctors/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
};
