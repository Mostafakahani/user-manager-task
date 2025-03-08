import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/user-data-service";
import { validateRegisterForm } from "@/lib/form-validation";
import { RegisterCredentials } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateRegisterForm(body);
    if (!validation.success) {
      const errorMessages = validation.errors
        ? Object.values(validation.errors)
            .map((error) => error)
            .join(", ")
        : "Unspecified errors";
      return NextResponse.json(
        { error: `The entered information is not valid: ${errorMessages}` },
        { status: 400 }
      );
    }

    const validatedData = validation.data as RegisterCredentials;

    const existingUser = await getUserByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: "This email has already been registered" },
        { status: 400 }
      );
    }

    const newUser = await createUser({
      first_name: validatedData.first_name,
      last_name: validatedData.last_name,
      email: validatedData.email,
      password: validatedData.password,
      avatar: `https://reqres.in/img/faces/2-image.jpg`,
    });

    return NextResponse.json(
      { message: "Registration was successful", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in registration:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
