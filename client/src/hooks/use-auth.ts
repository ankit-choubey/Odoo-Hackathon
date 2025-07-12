import { useState, useEffect } from "react";
import { User } from "@shared/schema";
import { AuthState, defaultAuthState, mockLogin, mockLogout, mockRegister } from "@/lib/auth";
import { getCurrentUser } from "@/lib/mock-data";

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  useEffect(() => {
    // Simulate checking for existing session
    const storedUser = localStorage.getItem("stackit_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        localStorage.removeItem("stackit_user");
      }
    } else {
      // For demo purposes, automatically log in as Jane Smith
      const currentUser = getCurrentUser();
      setAuthState({
        user: currentUser,
        isAuthenticated: true,
        isLoading: false,
      });
      localStorage.setItem("stackit_user", JSON.stringify(currentUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const user = await mockLogin(username, password);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      localStorage.setItem("stackit_user", JSON.stringify(user));
      return user;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      await mockLogout();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      localStorage.removeItem("stackit_user");
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const user = await mockRegister(userData);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      localStorage.setItem("stackit_user", JSON.stringify(user));
      return user;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  return {
    ...authState,
    login,
    logout,
    register,
  };
};
