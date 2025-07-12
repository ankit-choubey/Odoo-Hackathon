import { User } from "@shared/schema";
import { mockUsers } from "./mock-data";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

export const mockLogin = (username: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.username === username);
      if (user && password === "password") {
        resolve(user);
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000);
  });
};

export const mockLogout = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

export const mockRegister = (userData: {
  username: string;
  email: string;
  password: string;
}): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existingUser = mockUsers.find(u => u.username === userData.username || u.email === userData.email);
      if (existingUser) {
        reject(new Error("User already exists"));
      } else {
        const newUser: User = {
          id: mockUsers.length + 1,
          username: userData.username,
          email: userData.email,
          password: "hashed_password",
          reputation: 0,
          role: "user",
          avatar: null,
          createdAt: new Date(),
        };
        mockUsers.push(newUser);
        resolve(newUser);
      }
    }, 1000);
  });
};
