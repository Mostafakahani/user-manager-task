import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

export interface ExtendedJWT extends JWT {
  accessToken?: string;
}

export interface ExtendedSession extends Session {
  accessToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  first_name: string;
  last_name: string;
}
