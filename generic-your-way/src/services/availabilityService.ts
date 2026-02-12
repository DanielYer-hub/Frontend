import { api } from "./http";

export type AvRange = { from: string; to: string; place: Place };
export type AvSlot = { date: string; ranges: AvRange[] };
export type Availability = { busyAllWeek: boolean; slots: AvSlot[] };
export type Place = "tts" | "home" | "club";

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