import type { unnormalizedUser } from "./unnormalizedUser";
import type { User } from "./User";

export function normalizeUser(values: unnormalizedUser):User {
    return {
        name:{
            first: values.first,
            last: values.last
        },
        email: values.email,
        password: values.password,
        phone: values.phone,
        region: values.region,
        address: {
            country: values.country,
            city: values.city,
            street: values.street,
        },
        faction: values.faction 
    };
}