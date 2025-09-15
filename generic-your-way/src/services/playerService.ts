import { api } from "./http";

export type PlayerDTO = {
  _id: string;
  name: { first: string; last: string };
  email: string;
  region: string;
  address?: { country?: string; city?: string };
  faction?: string;
  points?: number;
  homeland?: string;
  planets?: string[];
};

const ENDPOINT = "/api/users"; 

export async function listPlayers(params: { region?: string; country?: string; city?: string }) {
  const q = new URLSearchParams();
  if (params.region)  q.set("region",  params.region);
  if (params.country) q.set("country", params.country);
  if (params.city)    q.set("city",    params.city);

  const url = q.toString() ? `${ENDPOINT}?${q.toString()}` : ENDPOINT;
  const { data } = await api.get(url);

  return (Array.isArray(data) ? data : data?.players ?? []) as PlayerDTO[];
}
