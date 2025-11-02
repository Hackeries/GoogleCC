export * from "./store"; // re-export everything from store.ts

// Alias to maintain compatibility with existing imports
import { useStore } from "./store";

// Re-export it as useAuthStore
export const useAuthStore = useStore;
