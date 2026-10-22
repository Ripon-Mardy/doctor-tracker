import { apiRequest } from "@/lib/api";

export interface DashboardSummary {
  totalDoctors: number;
  totalPatients: number;
  patientsToday: number;
}

export interface PatientsByDoctor {
  doctorId: string;
  doctorName: string;
  specialization: string;
  patientCount: number;
}

export interface PatientsByDate {
  date: string;
  patientCount: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  patientsByDoctor: PatientsByDoctor[];
  patientsByDate: PatientsByDate[];
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

export interface DashboardFilters {
  from?: string;
  to?: string;
}

export async function fetchDashboard(
  filters: DashboardFilters = {},
): Promise<DashboardData> {
  const params = new URLSearchParams();

  if (filters.from) {
    params.set("from", filters.from);
  }

  if (filters.to) {
    params.set("to", filters.to);
  }

  const queryString = params.toString();

  const response = await apiRequest<DashboardResponse>(
    `/dashboard${queryString ? `?${queryString}` : ""}`,
  );

  return response.data;
}
