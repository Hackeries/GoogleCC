// Re-export everything from store.ts
import { useStoreBase, useStore as useStoreWithSelectors } from "./store";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Export auth store with proper names
export const useStore = useStoreWithSelectors;
export const useAuthStore = useStoreBase;
export { useStoreBase };

// Define the shape of the app's global state
interface AppState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  setTheme: (theme: "light" | "dark") => void;
  toggleSidebar: () => void;
}

// App store with proper persistence setup (moved from root store.ts)
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
      name: "app-storage",
      storage: createJSONStorage<AppState>(() => localStorage),
      version: 1,
    }
  )
);
