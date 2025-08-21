import { api } from "./http";
import type { User } from "../interface/user/User";

export async function registerUser(normalizedUser: User) {
  const { data } = await api.post(
    "http://localhost:8181/api/auth/register", 
    normalizedUser
  );
  return data;
}

export async function loginUser(email: string, password: string) {
  const { data } = await api.post(
    "http://localhost:8181/api/auth/login",    
    { email, password }
  );
  return data;
}

export async function getUserById(id: string) {
  const { data } = await api.get(`/${id}`);
  return data;
}

export async function updateMe(patch: Partial<{ factionText: string }>) {
  const { data } = await api.patch("http://localhost:8181/api/users/me", patch);
  return data.user; 
}

export async function getMe() {
  const { data } = await api.get("http://localhost:8181/api/auth/me");
  return data.user;
}


