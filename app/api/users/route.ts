import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "@/lib/user-data-service";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const id = url.searchParams.get("id");

  console.log(`API GET request received - page: ${page}, id: ${id || "none"}`);

  try {
    if (id) {
      console.log(`Fetching user with ID: ${id}`);
      const user = getUserById(id);
      if (!user) {
        console.log(`User with ID ${id} not found`);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      console.log(
        `Successfully fetched user: ${user.first_name} ${user.last_name}`
      );
      return NextResponse.json({ data: user });
    }

    console.log(`Fetching users for page ${page}`);
    const usersData = getUsers(page);
    console.log(`Successfully fetched ${usersData.data.length} users`);
    return NextResponse.json(usersData);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.first_name || !body.last_name || !body.email || !body.password) {
      return NextResponse.json(
        { error: "First name, last name, password, and email are required" },
        { status: 400 }
      );
    }

    const newUser = createUser(body);

    return NextResponse.json(newUser, { status: 201 });
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
  const userId = url.searchParams.get("id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const updatedUser = updateUser(userId, body);

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
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
  const userId = url.searchParams.get("id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const success = deleteUser(userId);

    if (!success) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
