import { create } from "zustand";
const useAppStore = create((set) => ({
  isAuthModalOpen: false,
  authView: null,
  authError: null,

  openAuthModal: (view) => set({ isAuthModalOpen: true, authView: view }),
  closeAuthModal: () => set({ isAuthModalOpen: false, authError: null }),
  setAuthError: (error) => set({ authError: error }),
  clearAuthError: () => set({ authError: null }),
}));

export default useAppStore;
