import type { UserAddress } from "./UserAddress";
import type { UserName } from "./UserName";


export interface User {
    name: UserName;
    email: string;
    password: string;
    phone: string;
    region: string;   
    address: UserAddress;
    faction: string; 
}