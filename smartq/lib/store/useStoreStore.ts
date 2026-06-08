import { create } from "zustand";
import { DarkStore } from "@/lib/types";
import { INITIAL_STORES } from "@/lib/simulation/seedData";

interface StoreStore {
  stores: DarkStore[];
  updateStoreLoad: (id: string, activeOrders: number) => void;
  getStoreById: (id: string) => DarkStore | undefined;
}

export const useStoreStore = create<StoreStore>((set, get) => ({
  stores: INITIAL_STORES,
  updateStoreLoad: (id, activeOrders) => set((state) => ({
    stores: state.stores.map((s) => (s.id === id ? { ...s, activeOrders } : s))
  })),
  getStoreById: (id) => get().stores.find((s) => s.id === id)
}));
