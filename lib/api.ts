import { User, UserResponse, UserFormData } from "@/types/user";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
console.log("API_BASE_URL:", BASE_URL);

export async function fetchUsers(
  page: number = 1,
  perPage: number = 6,
  token?: string
): Promise<UserResponse> {
  const url = `${BASE_URL}/api/users?page=${page}&per_page=${perPage}`;
  console.log("Fetching users from:", url);

  try {
    const response = await fetch(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to fetch users - Status: ${response.status}, Response: ${errorText}`
      );
      throw new Error(
        `Failed to fetch users: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data.data?.length || 0} users`);
    return data;
  } catch (error) {
    console.error("Error in fetchUsers:", error);
    throw error;
  }
}

export async function fetchUser(
  id: string,
  token?: string
): Promise<{ data: User }> {
  const response = await fetch(`${BASE_URL}/api/users?id=${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

export async function createUserApi(
  userData: UserFormData,
  token?: string
): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create user");
  }

  return response.json();
}

export async function updateUserApi(
  id: string,
  userData: UserFormData,
  token?: string
): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/users?id=${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update user");
  }

  return response.json();
}

export async function deleteUser(id: string, token?: string): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/api/users?id=${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete user");
  }

  return true;
}
