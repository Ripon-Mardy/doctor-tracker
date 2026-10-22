import { apiRequest } from "./api";
import type { Admin, LoginResponse, LogoutResponse } from "@/types/auth";

// login
export const login = async (
  email: string,
  password: string,
): Promise<Admin> => {
  const response = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return response.admin;
};

// current admin
export const getCurrentAdmin = async (): Promise<Admin> => {
  const response = await apiRequest<LoginResponse>("/auth/me");

  console.log("Current admin response:", response);

  return response.admin;
};

// logout
export const logout = async (): Promise<void> => {
  await apiRequest<LogoutResponse>("/auth/logout", { method: "POST" });
};
