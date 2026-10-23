import { apiRequest } from "@/lib/api";
import type {
  ApiResponse,
  DashboardStats,
  PatientsOverTimePoint,
  Range,
} from "./types";

// get patients Over time
export async function getPatientsOverTime(
  range: Range,
): Promise<PatientsOverTimePoint[]> {
  const json = await apiRequest<ApiResponse<PatientsOverTimePoint[]>>(
    `/dashboard/patients-over-time?range=${range}`,
  );

  if (!json.success) {
    throw new Error(json.message ?? "Could not load chart data");
  }

  return json.data;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const json = await apiRequest<ApiResponse<DashboardStats>>("/dashboard/stats");

  if (!json.success) {
    throw new Error(json.message ?? "Could not load stats");
  }

  return json.data;
}
