import NextAuth from "next-auth";
// import Auth0Provider from "next-auth/providers/auth0";
// import CredentialsProvider from "next-auth/providers/credentials";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
