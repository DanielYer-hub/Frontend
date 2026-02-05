import { api } from "./http";

export type FeedbackType = "problem" | "suggestion";

export type SendFeedbackPayload = {
  type: FeedbackType;
  title?: string;
  description: string;
  fromEmail?: string;
  fromName?: string;
};

export async function sendFeedback(payload: SendFeedbackPayload) {
  const { data } = await api.post("/feedback", payload);
  return data as { message: string };
}
