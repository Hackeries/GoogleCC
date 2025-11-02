import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define the shape of your app's global state
interface AppState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  setTheme: (theme: "light" | "dark") => void;
  toggleSidebar: () => void;
}

// Zustand store with proper persistence setup
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "light",
      sidebarOpen: true,
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: "app-storage", // Storage key name in localStorage
      storage: createJSONStorage<AppState>(() => localStorage),
      version: 1, // optional versioning for migrations
    }
  )
);
