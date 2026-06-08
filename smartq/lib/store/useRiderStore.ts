import { create } from "zustand";
import { Rider, RiderStatus } from "@/lib/types";
import { INITIAL_RIDERS } from "@/lib/simulation/seedData";

interface RiderStore {
  riders: Rider[];
  updateRiderPosition: (id: string, nodeId: string) => void;
  updateRiderStatus: (id: string, status: RiderStatus) => void;
  assignRiderToOrder: (id: string, orderId: string, route: string[]) => void;
  advanceRider: (id: string) => void;
  getAvailableRiders: () => Rider[];
}

export const useRiderStore = create<RiderStore>((set, get) => ({
  riders: INITIAL_RIDERS,
  updateRiderPosition: (id, nodeId) => set((state) => ({
    riders: state.riders.map((r) => (r.id === id ? { ...r, currentNodeId: nodeId } : r))
  })),
  updateRiderStatus: (id, status) => set((state) => ({
    riders: state.riders.map((r) => (r.id === id ? { ...r, status } : r))
  })),
  assignRiderToOrder: (id, orderId, route) => set((state) => ({
    riders: state.riders.map((r) => (r.id === id ? {
      ...r,
      assignedOrderIds: [...r.assignedOrderIds, orderId],
      currentRoute: route,
      currentRouteIndex: 0,
      status: "assigned"
    } : r))
  })),
  advanceRider: (id) => set((state) => ({
    riders: state.riders.map((r) => {
      if (r.id === id && r.currentRoute.length > 0) {
        const nextIndex = r.currentRouteIndex + 1;
        if (nextIndex >= r.currentRoute.length - 1) {
          return { ...r, currentRouteIndex: nextIndex, currentNodeId: r.currentRoute[nextIndex] || r.currentNodeId, status: "returning" };
        }
        return { ...r, currentRouteIndex: nextIndex, currentNodeId: r.currentRoute[nextIndex] };
      }
      return r;
    })
  })),
  getAvailableRiders: () => get().riders.filter((r) => r.status === "available")
}));
