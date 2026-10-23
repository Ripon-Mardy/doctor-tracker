export type Range = "7d" | "30d" | "12m";

export type PatientsOverTimePoint = {
  date: string; // ISO date, e.g. "2026-10-01"
  count: number;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type DashboardStats = {
  totalDoctors: number;
  totalPatients: number;
  newThisMonth: number;
  monthlyChange: number; // percent, e.g. 4.8 or -2.1
  activePatients: number;
};

export type PatientsPerDoctor = {
  doctorId: string;
  name: string;
  patients: number;
};

export type DoctorsBySpecialization = {
  specialization: string;
  doctors: number;
};
