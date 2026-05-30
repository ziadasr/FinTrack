import api from "../config/api";
import type { Auth, LoginRequest, RegisterRequest, AuthStatus } from "../types/auth";

export async function checkStatus(): Promise<AuthStatus> {
  const res = await api.get("/auth/status");
  return res.data;
}

export async function login(data: LoginRequest): Promise<Auth> {
  const res = await api.post("/auth/login", data);
  return res.data;
}

export async function register(data: RegisterRequest): Promise<Auth> {
  const res = await api.post("/auth/register", data);
  return res.data;
}

export async function resetPassword(username: string, newPassword: string): Promise<Auth> {
  const res = await api.post("/auth/reset-password", { username, newPassword });
  return res.data;
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
}
