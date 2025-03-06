import fs from "fs";
import path from "path";
import { User, UserResponse, UserFormData } from "@/types/user";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE_PATH = path.join(DATA_DIR, "users.json");

const ensureDataDir = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create data directory: ${error.message}`);
    } else {
      throw new Error("Failed to create data directory: Unknown error");
    }
  }
};

const initDataFile = () => {
  try {
    ensureDataDir();

    if (!fs.existsSync(DATA_FILE_PATH)) {
      const initialData: UserResponse = {
        page: 1,
        per_page: 6,
        total: 12,
        total_pages: 2,
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

      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(initialData, null, 2));
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to initialize data file: ${error.message}`);
    } else {
      throw new Error("Failed to initialize data file: Unknown error");
    }
  }
};

const readData = (): UserResponse => {
  try {
    initDataFile();
    const data = fs.readFileSync(DATA_FILE_PATH, "utf-8");
    return JSON.parse(data) as UserResponse;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to read data file: ${error.message}`);
    } else {
      throw new Error("Failed to read data file: Unknown error");
    }
  }
};

const writeData = (data: UserResponse) => {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
};

export const getUsers = (page: number, perPage: number = 6): UserResponse => {
  const data = readData();
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  const paginatedData: UserResponse = {
    page,
    per_page: perPage,
    total: data.data.length,
    total_pages: Math.ceil(data.data.length / perPage),
    data: data.data.slice(startIndex, endIndex),
  };

  return paginatedData;
};

export const getUserById = (id: string): User | null => {
  const data = readData();
  const user = data.data.find((user) => user.id === parseInt(id));
  return user || null;
};

export const createUser = (userData: UserFormData): User => {
  const data = readData();

  const highestId = data.data.reduce((max, user) => Math.max(max, user.id), 0);
  const newUser: User = {
    ...userData,
    id: highestId + 1,
    avatar:
      userData.avatar ||
      `https://reqres.in/img/faces/${highestId + 1}-image.jpg`,
    password: userData.password || "1234",
  };

  data.data.push(newUser);
  data.total = data.data.length;
  data.total_pages = Math.ceil(data.data.length / data.per_page);

  writeData(data);

  return newUser;
};

export const updateUser = (id: string, userData: UserFormData): User | null => {
  const data = readData();
  const userIndex = data.data.findIndex((user) => user.id === parseInt(id));

  if (userIndex === -1) {
    return null;
  }

  const updatedUser: User = {
    ...data.data[userIndex],
    ...userData,
  };

  data.data[userIndex] = updatedUser;

  writeData(data);

  return updatedUser;
};

export const deleteUser = (id: string): boolean => {
  const data = readData();
  const userIndex = data.data.findIndex((user) => user.id === parseInt(id));

  if (userIndex === -1) {
    return false;
  }

  data.data.splice(userIndex, 1);
  data.total = data.data.length;
  data.total_pages = Math.ceil(data.data.length / data.per_page);

  writeData(data);

  return true;
};

export const checkUserCredentials = async (
  email: string,
  password: string
): Promise<any> => {
  try {
    const data = readData();
    const user = data.data.find(
      (user) => user.email === email && user.password === password
    );

    if (!user) {
      return null;
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      id: String(userWithoutPassword.id),
    };
  } catch (error) {
    console.error("Error checking user credentials:", error);
    return null;
  }
};

try {
  console.log("Running initial setup of user data service...");
  initDataFile();
  console.log("Initial setup completed successfully.");
} catch (error) {
  console.error("Error during initial setup:", error);
}
