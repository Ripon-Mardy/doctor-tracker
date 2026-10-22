export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorListResponse {
  success: boolean;
  doctors: Doctor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DoctorResponse {
  success: boolean;
  message?: string;
  doctor: Doctor;
}

export interface DoctorFormValues {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}
