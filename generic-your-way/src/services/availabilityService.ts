import { api } from "./http";
const ROOT = import.meta.env.VITE_API_ROOT;

export type AvRange = { from: string; to: string };
export type AvDay = { day: number; ranges: AvRange[] };
export type Availability = { busyAllWeek: boolean; days: AvDay[] };

export async function getMyAvailability() {
  const { data } = await api.get(`${ROOT}/api/availability/me`);
  return data.availability as Availability;
}
export async function updateMyAvailability(payload: Availability) {
  const { data } = await api.patch(`${ROOT}/api/availability/me`, payload);
  return data.availability as Availability;
}
export async function getPublicAvailability(userId: string) {
  const { data } = await api.get(`${ROOT}/api/availability/${userId}`);
  return data.availability as Availability;
}