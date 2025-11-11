import { api } from "./http";

const ROOT = import.meta.env.VITE_API_ROOT;
const ENDPOINT = "/api/users"; 

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

export type PublicPlayer = {
  _id: string;
  name?: { first?: string; last?: string };
  email?: string;
  region?: string;
  address?: { country?: string; city?: string };
  settings?: string[];
  image?: { url?: string | null } | null;
  bio?: string | null;
};

function absolutizeImage<T extends { image?: { url?: string | null } | null }>(u: T): T {
  const url = u.image?.url || null;
  if (!url) return u;
  const absolute =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `${ROOT}${url.startsWith("/") ? "" : "/"}${url}`;
  return { ...u, image: { ...(u.image || {}), url: absolute } } as T;
}

export async function listPlayers(params: { region?: string; country?: string; city?: string }) {
  const q = new URLSearchParams();
  if (params.region)  q.set("region",  params.region);
  if (params.country) q.set("country", params.country);
  if (params.city)    q.set("city",    params.city);
  const url = q.toString() ? `${ENDPOINT}?${q.toString()}` : ENDPOINT;
  const { data } = await api.get(url);
  return (Array.isArray(data) ? data : data?.players ?? []) as PlayerDTO[];
}

export async function listPublicPlayers(params: {
  setting?: string;
  region?: string;
  country?: string;
  city?: string;
  day?: number;      
  from?: string;
}): Promise<PublicPlayer[]> {
  const q = new URLSearchParams();
  if (params.setting) q.set("setting", params.setting);
  if (params.region) q.set("region", params.region);
  if (params.country) q.set("country", params.country);
  if (params.city) q.set("city", params.city);
  if (typeof params.day === "number") q.set("day", String(params.day));
  if (params.from) q.set("from", params.from);
  const { data } = await api.get(`${ROOT}/api/public/players?${q.toString()}`);
  const players = (data.players || []) as PublicPlayer[];
  return players.map(absolutizeImage);
}