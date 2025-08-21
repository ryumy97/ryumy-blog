import { create } from "zustand";

interface NavState {
  headerHeight: number;
  setHeaderHeight: (height: number) => void;
}

export const useNavStore = create<NavState>((set) => ({
  headerHeight: 0,
  setHeaderHeight: (height: number) => set({ headerHeight: height }),
}));
