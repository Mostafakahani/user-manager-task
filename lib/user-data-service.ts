import fs from "fs/promises";
import path from "path";
import { User, UserResponse, UserFormData } from "@/types/user";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE_PATH = path.join(DATA_DIR, "users.json");

const ensureDataDir = async () => {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
};

const initDataFile = async () => {
  try {
    await ensureDataDir();

    try {
      await fs.access(DATA_FILE_PATH);
    } catch {
      const initialData: UserResponse = {
        page: 1,
        per_page: 6,
        total: 1,
        total_pages: 1,
        data: [
          {
            id: 1,
            email: "george.bluth@reqres.in",
            first_name: "George",
            last_name: "Bluth",
            avatar: "https://reqres.in/img/faces/1-image.jpg",
            password: "1234",
          },
        ],
      };

      await fs.writeFile(DATA_FILE_PATH, JSON.stringify(initialData, null, 2));
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to initialize data file: ${error.message}`);
    } else {
      throw new Error("Failed to initialize data file: Unknown error");
    }
  }
};

const readData = async (): Promise<UserResponse> => {
  try {
    await initDataFile();
    const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(data) as UserResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read data file: ${error.message}`);
    } else {
      throw new Error("Failed to read data file: Unknown error");
    }
  }
};

const writeData = async (data: UserResponse): Promise<void> => {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));
};

export const getUsers = async (
  page: number,
  perPage: number = 6
): Promise<UserResponse> => {
  const data = await readData();
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    page,
    per_page: perPage,
    total: data.data.length,
    total_pages: Math.ceil(data.data.length / perPage),
    data: data.data.slice(startIndex, endIndex),
  };
};

export const getUserById = async (id: string): Promise<User | null> => {
  const data = await readData();
  const user = data.data.find((user: User) => user.id === parseInt(id));
  return user || null;
};

export const createUser = async (userData: UserFormData): Promise<User> => {
  const data = await readData();

  const highestId = data.data.reduce(
    (max: number, user: User) => Math.max(max, user.id),
    0
  );

  const newUser: User = {
    ...userData,
    id: highestId + 1,
    avatar: userData.avatar || `https://reqres.in/img/faces/2-image.jpg`,
    password: userData.password || "1234",
  };

  data.data.push(newUser);
  data.total = data.data.length;
  data.total_pages = Math.ceil(data.total / data.per_page);

  await writeData(data);

  return newUser;
};

export const updateUser = async (
  id: string,
  userData: UserFormData
): Promise<User | null> => {
  const data = await readData();
  const userIndex = data.data.findIndex(
    (user: User) => user.id === parseInt(id)
  );

  if (userIndex === -1) {
    return null;
  }

  const updatedUser: User = {
    ...data.data[userIndex],
    ...userData,
  };

  data.data[userIndex] = updatedUser;

  await writeData(data);

  return updatedUser;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const data = await readData();
  const userIndex = data.data.findIndex(
    (user: User) => user.id === parseInt(id)
  );

  if (userIndex === -1) {
    return false;
  }

  data.data.splice(userIndex, 1);
  data.total = data.data.length;
  data.total_pages = Math.ceil(data.total / data.per_page);

  await writeData(data);

  return true;
};

export async function checkUserCredentials(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const usersData: UserResponse = JSON.parse(fileContent);

    const user = usersData.data.find(
      (u) => u.email === email && u.password === password
    );

    return user || null;
  } catch (error) {
    console.error("خطا در بررسی اعتبار کاربر:", error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const usersData: UserResponse = JSON.parse(fileContent);

    const user = usersData.data.find((u) => u.email === email);
    return user || null;
  } catch (error) {
    console.error("خطا در یافتن کاربر:", error);
    return null;
  }
}

// اجرای تنظیمات اولیه
try {
  console.log("Running initial setup of user data service...");
  void initDataFile();
  console.log("Initial setup completed successfully.");
} catch (error) {
  console.error("Error during initial setup:", error);
}
