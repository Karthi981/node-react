import { create } from "zustand";
import {
  ApiError,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../lib/api";
import type { AuthUser } from "../lib/api";

type AuthStore = {
  user: AuthUser | null;
  isChecking: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isChecking: true,
  error: null,

  checkAuth: async () => {
    set({ isChecking: true, error: null });
    try {
      const user = await getCurrentUser();
      set({ user });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        set({ user: null });
      } else {
        set({
          user: null,
          error:
            error instanceof Error ? error.message : "Could not connect to API",
        });
      }
    } finally {
      set({ isChecking: false });
    }
  },

  login: async (email, password) => {
    set({ error: null });
    try {
      const user = await loginUser(email, password);
      set({ user, error: null });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Login failed",
      });
      return false;
    }
  },

  signUp: async (name, email, password) => {
    set({ error: null });
    try {
      await registerUser(name, email, password);
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Sign up failed",
      });
      return false;
    }
  },

  logout: async () => {
    set({ error: null });
    try {
      await logoutUser();
      set({ user: null });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Logout failed",
      });
      throw error;
    }
  },
}));

export { useAuthStore };
