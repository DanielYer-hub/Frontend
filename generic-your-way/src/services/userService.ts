import { api } from "./http";
import type { User } from "../interface/user/User";

export async function registerUser(normalizedUser: User) {
  const { data } = await api.post("/auth/register", normalizedUser);
  return data;
}

export async function loginUser(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function getUserById(id: string) {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export async function updateMe(patch: any) {
  const { data } = await api.patch("/users/me", patch);
  return data.user;
}

export async function getMe() {
  const { data } = await api.get("/users/me");
  return data.user;
}

export async function uploadMyPhoto(file: File) {
  const fd = new FormData();
  fd.append("photo", file);
  const { data } = await api.post("/users/me/photo", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.user;
}


