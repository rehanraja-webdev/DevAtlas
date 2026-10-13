import { create } from "zustand";
import api from "../api/client.js";

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data: meRes } = await api.get("/auth/me");
      const user = meRes?.data?.user;

      let profile = null;
      try {
        const { data: profRes } = await api.get("/profile");
        profile = profRes?.data?.profile;
      } catch {
        // Profile might be newly created
      }

      set({
        user,
        profile,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  login: async (email, password) => {
    try {
      set({ error: null });
      const { data } = await api.post("/auth/login", { email, password });
      const user = data?.data?.user;

      let profile = null;
      try {
        const { data: profRes } = await api.get("/profile");
        profile = profRes?.data?.profile;
      } catch {
        // Optional profile fetch
      }

      set({
        user,
        profile,
        isAuthenticated: true,
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Login failed";
      set({ error: message });
      return { success: false, message };
    }
  },

  register: async (fullname, email, password) => {
    try {
      set({ error: null });
      await api.post("/auth/register", { fullname, email, password });
      // After registration, log them in immediately
      return await get().login(email, password);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Registration failed";
      set({ error: message });
      return { success: false, message };
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore logout network errors
    } finally {
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
      });
    }
  },

  refreshProfile: async () => {
    try {
      const { data } = await api.get("/profile");
      set({ profile: data?.data?.profile });
    } catch (err) {
      console.error("Failed to refresh profile", err);
    }
  },

  setProfile: (profile) => set({ profile }),
}));
