// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User, Session } from "next-auth";
import {
  checkUserCredentials,
  createUser,
  getUserByEmail,
} from "./user-data-service";
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
      issuer: `https://${process.env.AUTH0_DOMAIN}`,
      authorization: {
        params: {
          prompt: "login",
          scope: "openid profile email",
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
    async signIn({ user, account, profile }) {
      if (account?.provider === "auth0") {
        try {
          const existingUser = await getUserByEmail(user.email!);

          if (!existingUser) {
            await createUser({
              first_name:
                (profile as any).given_name || user.name?.split(" ")[0] || "",
              last_name:
                (profile as any).family_name || user.name?.split(" ")[1] || "",
              email: user.email!,
              password: `auth0_${Date.now()}`,
              avatar: user.image || `https://reqres.in/img/faces/2-image.jpg`,
            });
          } else if (!existingUser.password.startsWith("auth0_")) {
            console.error("This email is already registered with credentials");
            return false;
          }
          return true;
        } catch (error) {
          console.error("Error saving Auth0 user:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        if (profile) {
          token.auth0Profile = profile;
        }
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
