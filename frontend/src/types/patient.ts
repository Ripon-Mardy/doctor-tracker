export type PatientGender = "male" | "female" | "other";

export interface PatientDoctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
}

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: PatientGender;
  phone: string;
  condition: string;
  doctor: PatientDoctor;
  createdAt: string;
  updatedAt: string;
}

export interface PatientFormValues {
  name: string;
  age: number;
  gender: PatientGender;
  phone: string;
  condition: string;
  doctor: string;
}

export interface PatientListResponse {
  success: boolean;
  patients: Patient[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PatientResponse {
  success: boolean;
  message?: string;
  patient: Patient;
}
