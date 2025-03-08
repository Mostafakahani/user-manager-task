// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User, Session } from "next-auth";
import { checkUserCredentials } from "./user-data-service";
import {
  //   ExtendedJWT,
  //   ExtendedSession,
  loginCredentialsSchema,
} from "@/types/auth";
import { validateData } from "./validation";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CustomUser extends User {
  accessToken?: string;
  idToken?: string;
}

interface CustomSession extends Session {
  user: CustomUser;
}

export const authOptions: NextAuthOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER!,
      authorization: {
        params: {
          prompt: "login",
          response_type: "code",
          scope: "openid profile email",
          redirect_uri: "http://localhost:3000/api/auth/callback/auth0",
        },
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // اعتبارسنجی داده‌های ورودی با Zod
        const validationResult = validateData(loginCredentialsSchema, {
          email: credentials.email,
          password: credentials.password,
        });

        if (!validationResult.success) {
          console.error("اعتبارسنجی ناموفق:", validationResult.errors);
          return null;
        }

        const user = await checkUserCredentials(
          validationResult.data.email,
          validationResult.data.password
        );

        if (user) {
          return {
            id: user.id.toString(),
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            image: user.avatar,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/logout",
    newUser: "/auth/register",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          accessToken: token.accessToken as string,
          idToken: token.idToken as string,
        },
      } as CustomSession;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};
