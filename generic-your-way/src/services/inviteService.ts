import { api } from "./http";


export type InviteDTO = {
  _id: string;
  fromUser?: any;
  toUser?: any;
  message?: string;
  status: "pending"|"accepted"|"declined"|"canceled";
  createdAt: string;
  slot?: InviteSlot | null;
  slotReadable?: string | null;
};

export type ChatInfo = {
  preferred: "whatsapp" | "telegram" | "none";
  whatsAppUrl?: string | null;
  telegramUrl?: string | null;
};

export type AcceptInviteDTO = {
  message: string;
  inviteId: string;
  opponent: { id: string; name: { first?: string; last?: string } };
  chat?: ChatInfo; 
};

export type InviteSlot = {
   day: number; 
   from?: string | null; 
   to?: string | null 
  };

export async function createInvite(
  targetUserId: string,
  slot: { day:number; from?:string; to?:string },
  setting?: string
) {
  const { data } = await api.post("/invites/create", { targetUserId, slot, setting });
  return data.invite;
}

export async function getIncomingInvites() {
  const { data } = await api.get("/invites/incoming");
  return (data.invites || []) as InviteDTO[];
}

export async function getOutgoingInvites() {
  const { data } = await api.get("/invites/outgoing");
  return (data.invites || []) as InviteDTO[];
}

export async function acceptInvite(id: string): Promise<AcceptInviteDTO> {
  const { data } = await api.post(`/invites/${id}/accept`);
  return data as AcceptInviteDTO;
}

export async function declineInvite(id: string) {
  const { data } = await api.post(`/invites/${id}/decline`);
  return data.invite as InviteDTO;
}

export async function cancelInvite(id: string) {
  const { data } = await api.post(`/invites/${id}/cancel`);
  return data.invite as InviteDTO;
}
