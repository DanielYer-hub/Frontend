import * as yup from "yup";

const e164 = /^\+?[1-9]\d{6,14}$/;         
const tgUser = /^[a-zA-Z0-9_]{5,32}$/;     

export const contactsSchema = yup.object({
  phoneE164: yup
    .string()
    .trim()
    .matches(e164, "Must be like +972501234567")
    .nullable()
    .optional(),
  telegramUsername: yup
    .string()
    .trim()
    .transform((val) => (val ? val.replace(/^@/, "") : val))
    .matches(tgUser, "5–32 letters/digits/_")
    .nullable()
    .optional(),
}).test(
  "at-least-one",
  "Provide WhatsApp phone OR Telegram username",
  (v) => !!(v?.phoneE164 || v?.telegramUsername)
);
