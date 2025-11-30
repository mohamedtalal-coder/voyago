import { create } from "zustand";
import axios from "axios";
import useAppStore from "./useAppStore";

const API_URL = "/api/auth";

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error("Could not parse user from localStorage", e);
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  user: getUserFromStorage(),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const userData = response.data;

      localStorage.setItem("user", JSON.stringify(userData));
      set({ user: userData, isLoading: false });
      useAppStore.getState().closeAuthModal();
    } catch (error) {
      const message = error.response?.data?.message || "An unknown login error occurred";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    set({ user: null, isLoading: false, error: null });
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/register`, { name, email, password });
      const userData = response.data;

      localStorage.setItem("user", JSON.stringify(userData));
      set({ user: userData, isLoading: false });
      useAppStore.getState().closeAuthModal();
      return userData;
    } catch (error) {
      const message = error.response?.data?.message || "An unknown registration error occurred";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  setGoogleAuth: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData, isLoading: false, error: null });
  },

  updateUser: async (updates) => {
    const currentUser = get().user;
    if (!currentUser) return;

    set({ isLoading: true, error: null });

    try {
      const response = await axios.put(`${API_URL}/profile`, updates, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });

      const updatedUser = {
        ...currentUser,
        ...response.data,
        token: currentUser.token,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });
      return updatedUser;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update profile";
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },
}));
