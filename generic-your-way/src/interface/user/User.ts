import type { UserAddress } from "./UserAddress";
import type { UserName } from "./UserName";

export interface User {
    name: UserName;
    email: string;
    password: string;
    region: string;   
    address: UserAddress;
    settings: string[];
    image?: { url?: string };
    bio?: string;
    contacts: {
    phoneE164?: string;
    telegramUsername?: string;
  };
}