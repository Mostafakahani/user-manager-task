import { z } from "zod";
import { userFormDataSchema } from "@/types/user";
import { loginCredentialsSchema, registerSchema } from "@/types/auth";

export function validateUserForm(formData: unknown) {
  try {
    const data = formData as Record<string, any>;
    const errors: Record<string, string> = {};

    if (!data.first_name || data.first_name.trim() === "") {
      errors.first_name = "First name is required";
    }

    if (!data.last_name || data.last_name.trim() === "") {
      errors.last_name = "Last name is required";
    }

    if (!data.email || data.email.trim() === "") {
      errors.email = "Email is required";
    }

    if (!data.password || data.password.trim() === "") {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    const validData = userFormDataSchema.parse(formData);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        formattedErrors[path] = err.message;
      });
      return { success: false, errors: formattedErrors };
    }
    throw error;
  }
}

export function validateLoginForm(formData: unknown) {
  try {
    const validData = loginCredentialsSchema.parse(formData);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        formattedErrors[path] = err.message;
      });
      return { success: false, errors: formattedErrors };
    }
    throw error;
  }
}

export function validateRegisterForm(formData: unknown) {
  try {
    const validData = registerSchema.parse(formData);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        formattedErrors[path] = err.message;
      });
      return { success: false, errors: formattedErrors };
    }
    throw error;
  }
}
