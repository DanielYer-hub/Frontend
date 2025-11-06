import * as yup from "yup";

const e164 = /^\+?[1-9]\d{6,14}$/;
const tgUser = /^[a-zA-Z0-9_]{5,32}$/;

export const profileSchema = yup.object({
  name: yup.object({
    first: yup.string().min(2).max(256).required(),
    last:  yup.string().min(2).max(256).required(),
  }),
  email:  yup.string().email().required(),
  region: yup.string().required(),
  address: yup.object({
    country: yup.string().nullable(),
    city: yup.string().nullable(),
  }),
  settings: yup.array(yup.string()).min(1, "Select at least one"),
  bio: yup.string().max(2000).nullable(),
  image: yup.object({
    url: yup.string().url().nullable(),
    
  }),
  contacts: yup.object({
    phoneE164: yup.string().nullable().test({
      name: "e164",
      message: "Use E.164, e.g. Your WA number.",
      test: v => !v || e164.test(v),
    }),
    telegramUsername: yup.string().nullable().test({
      name: "tg",
      message: "5–32 chars, letters/digits/_ (no @)",
      test: v => !v || tgUser.test(v.replace(/^@/, "")),
    }),
  }),
});
