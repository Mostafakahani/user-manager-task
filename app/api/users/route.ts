import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "@/lib/user-data-service";
import { validateRequest } from "@/lib/validation";
import { userFormDataSchema } from "@/types/user";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("per_page") || "6");

    if (id) {
      const user = await getUserById(id);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ data: user });
    }

    const users = await getUsers(page, perPage);
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const validationResult = await validateRequest(userFormDataSchema, request);
  if (validationResult instanceof NextResponse) {
    return validationResult;
  }

  try {
    const { data } = validationResult;
    console.log("Creating new user:", data.email);
    const newUser = await createUser(data);
    console.log(`User created successfully with ID: ${newUser.id}`);
    return NextResponse.json({ data: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const validationResult = await validateRequest(userFormDataSchema, request);
  if (validationResult instanceof NextResponse) {
    return validationResult;
  }

  try {
    const { data } = validationResult;
    console.log(`Updating user with ID: ${id}`);
    const updatedUser = await updateUser(id, data);
    if (!updatedUser) {
      console.log(`User with ID ${id} not found for update`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log(`User updated successfully: ${updatedUser.email}`);
    return NextResponse.json({ data: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    console.log(`Deleting user with ID: ${id}`);
    const success = await deleteUser(id);
    if (!success) {
      console.log(`User with ID ${id} not found for deletion`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log(`User deleted successfully: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
