// lib/api.ts
import { UserFormData } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://reqres.in/api";

export async function fetchUsers(page = 1, token?: string) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/users?page=${page}`, {
      next: { revalidate: 60 }, // Revalidate every minute
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function fetchUser(id: string, token?: string) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/users/${id}`, {
      next: { revalidate: 60 },
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user with id ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
}

// Add other API functions
export async function createUser(userData: UserFormData, token?: string) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers,
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(
  id: string,
  userData: UserFormData,
  token?: string
) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user with id ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
}

export async function deleteUser(id: string, token?: string) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete user with id ${id}`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
}
