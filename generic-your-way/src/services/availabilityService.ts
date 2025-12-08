import { api } from "./http";


export type AvRange = { from: string; to: string };
export type AvDay = { day: number; ranges: AvRange[] };
export type Availability = { busyAllWeek: boolean; days: AvDay[] };

export async function getMyAvailability() {
  const { data } = await api.get("/availability/me");
  return data.availability as Availability;
}
export async function updateMyAvailability(payload: Availability) {
  const { data } = await api.patch("/availability/me", payload);
  return data.availability as Availability;
}
export async function getPublicAvailability(userId: string) {
  const { data } = await api.get(`/availability/${userId}`);
  return data.availability as Availability;
}