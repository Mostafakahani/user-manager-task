import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email({ message: "Invalid email" }),
  first_name: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  last_name: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  avatar: z.string().url({ message: "Invalid image URL" }).optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const userResponseSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  total: z.number(),
  total_pages: z.number(),
  data: z.array(userSchema),
});

export const userFormDataSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  last_name: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email" }),
  avatar: z.string().url({ message: "Invalid image URL" }).optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const apiResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    data: schema,
    status: z.number(),
    message: z.string().optional(),
  });

export type User = z.infer<typeof userSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserFormData = z.infer<typeof userFormDataSchema>;
export type ApiResponse<T> = z.infer<
  ReturnType<typeof apiResponseSchema<z.ZodType<T>>>
>;
