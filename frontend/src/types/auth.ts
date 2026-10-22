export interface Admin {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  admin: Admin;
}

export interface CurrentAdminResponse {
  success: boolean;
  admin: Admin;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}
