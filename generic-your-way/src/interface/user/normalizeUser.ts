import type { unnormalizedUser } from "./unnormalizedUser";
import type { User } from "./User";

export function normalizeUser(values: unnormalizedUser):User {
const phone = values.contacts?.phoneE164?.replace(/(?!^\+)\D/g, "");
const tg = values.contacts?.telegramUsername?.replace(/^@/, "");

    return {
        name:{
            first: values.first,
            last: values.last
        },
        email: values.email,
        password: values.password,
        region: values.region,
        address: {
            country: values.country,
            city: values.city,
        },
        settings: values.settings ?? [],
        contacts: {
      ...(phone ? { phoneE164: phone } : {}),
      ...(tg ? { telegramUsername: tg } : {}),
    },
    };
}