import { api } from "./http";

export async function getMyFavorites(): Promise<string[]> {
  const { data } = await api.get("/favorites/me");
  return (data.favorites || []) as string[];
}

export async function toggleFavorite(playerId: string): Promise<{ favorites: string[]; isFavorite: boolean }> {
  const { data } = await api.patch(`/favorites/me/${playerId}`);
  return data;
}
