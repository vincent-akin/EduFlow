import { apiRequest } from "@/lib/api/client";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "school_admin" | "teacher" | "student" | "parent";
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export function login(input: { email: string; password: string }) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "school_admin" | "teacher" | "student" | "parent";
  schoolId: string;
}

export interface RegisterResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  schoolId: string;
}

export function register(input: RegisterInput) {
  return apiRequest<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
