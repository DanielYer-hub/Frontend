export interface unnormalizedUser {
    first: string;
    last: string;
    email: string;
    password: string;
    region: string;
    country: string;
    city: string;
    settings: string[];
    contacts: {
    phoneE164?: string;          
    telegramUsername?: string;   
  };
}