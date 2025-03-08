import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { z } from "zod";

export const extendedJWTSchema = z.object({
  accessToken: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  picture: z.string().optional(),
  sub: z.string().optional(),
  iat: z.number().optional(),
  exp: z.number().optional(),
  jti: z.string().optional(),
});

export const extendedSessionSchema = z.object({
  accessToken: z.string().optional(),
  expires: z.string().optional(),
  user: z
    .object({
      name: z.string().optional(),
      email: z.string().optional(),
      image: z.string().optional(),
    })
    .optional(),
});

export const loginCredentialsSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export type ExtendedJWT = z.infer<typeof extendedJWTSchema> & JWT;
export type ExtendedSession = z.infer<typeof extendedSessionSchema> & Session;
export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;
