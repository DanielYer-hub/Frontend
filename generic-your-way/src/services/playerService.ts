import { api } from "./http";

const ROOT = import.meta.env.VITE_API_ROOT;
const ENDPOINT = "/users"; 

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

const FILE_ROOT = ROOT.replace(/\/api\/?$/, "");

function absolutizeImage<T extends { image?: { url?: string | null } | null }>(
  u: T
): T {
  const url = u.image?.url || null;
  if (!url) return u;
  const absolute =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `${FILE_ROOT}${url.startsWith("/") ? "" : "/"}${url}`;
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

export type Place = "tts" | "home" | "club";

export async function listPublicPlayers(params: {
  setting?: string;
  country?: string;
  city?: string;
  date?: string;      
  from?: string;
  place?: Place | "";
  favorites?: string; 
}): Promise<PublicPlayer[]> {
  const q = new URLSearchParams();
  if (params.setting) q.set("setting", params.setting);
  if (params.country) q.set("country", params.country);
  if (params.city) q.set("city", params.city);
  if (params.date) q.set("date", params.date);
  if (params.from) q.set("from", params.from);
  if (params.place) q.set("place", params.place);
  const { data } = await api.get(`/public/players?${q.toString()}`);
  const players = (data.players || []) as PublicPlayer[];
  return players.map(absolutizeImage);
}
 
export async function listFavoritePlayers(params: {
  setting?: string;
  country?: string;
  city?: string;
  date?: string;
  from?: string;
  place?: string;
  favorites?: string;
}): Promise<PublicPlayer[]> {
  const q = new URLSearchParams();
  if (params.setting) q.set("setting", params.setting);
  if (params.country) q.set("country", params.country);
  if (params.city) q.set("city", params.city);
  if (params.date) q.set("date", params.date);
  if (params.from) q.set("from", params.from);
  if (params.place) q.set("place", params.place);

  const { data } = await api.get(`/public/players/favorites?${q.toString()}`);
  const players = (data.players || []) as PublicPlayer[];
  return players.map(absolutizeImage);
}
