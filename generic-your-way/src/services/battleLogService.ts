import { api } from "./http";

export async function createChallenge(defenderId: string, planetName: string, result: "win"|"draw"|"lose") {
  const { data } = await api.post("/api/battlelog/create", { defenderId, planetName, result });
  return data.battle;
}
export async function getIncoming() {
  const { data } = await api.get("/api/battlelog/incoming");
  return data.battles;
}
export async function getOutgoing() {
  const { data } = await api.get("/api/battlelog/outgoing");
  return data.battles;
}
export async function confirmBattle(battleId: string) {
  const { data } = await api.post("/api/battlelog/confirm", { battleId });
  return data.battle;
}
export async function cancelBattle(battleId: string) {
  const { data } = await api.post("/api/battlelog/cancel", { battleId });
  return data;
}
export async function getBattle(battleId: string) {
  const { data } = await api.get(`/api/battlelog/${battleId}`);
  return data.battle;
}
export async function setBattleResult(battleId: string, result: "win"|"lose"|"draw") {
  const { data } = await api.patch(`/api/battlelog/${battleId}/result`, { result });
  return data.battle;
}