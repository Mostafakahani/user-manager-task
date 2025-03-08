import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { userSchema, userFormDataSchema } from "@/types/user";
import { loginCredentialsSchema, registerSchema } from "@/types/auth";

export function validateData<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
):
  | { success: true; data: z.infer<T> }
  | { success: false; errors: z.ZodError } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

export async function validateRequest<T extends z.ZodTypeAny>(
  schema: T,
  request: NextRequest
): Promise<{ success: true; data: z.infer<T> } | NextResponse> {
  try {
    const body = await request.json();
    const result = validateData(schema, body);

    if (!result.success) {
      const formattedErrors = formatZodErrors(result.errors);
      return NextResponse.json(
        { error: "Invalid data", details: formattedErrors },
        { status: 400 }
      );
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error validating request:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 400 }
    );
  }
}

export function formatZodErrors(errors: z.ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {};

  for (const error of errors.errors) {
    const path = error.path.join(".");
    formattedErrors[path] = error.message;
  }

  return formattedErrors;
}

export const validateUserForm = (data: unknown) =>
  validateData(userFormDataSchema, data);
export const validateLoginCredentials = (data: unknown) =>
  validateData(loginCredentialsSchema, data);
export const validateRegisterCredentials = (data: unknown) =>
  validateData(registerSchema, data);
export const validateUser = (data: unknown) => validateData(userSchema, data);
