import { create } from "zustand";
import { TrafficEvent } from "@/lib/types";

interface TrafficStore {
  trafficEvents: TrafficEvent[];
  addTrafficEvent: (event: Omit<TrafficEvent, "id" | "startedAt">) => void;
  removeTrafficEvent: (id: string) => void;
  expireOldEvents: () => void;
  getActiveEvents: () => TrafficEvent[];
}

export const useTrafficStore = create<TrafficStore>((set, get) => ({
  trafficEvents: [],
  addTrafficEvent: (event) => set((state) => {
    const newEvent: TrafficEvent = {
      ...event,
      id: "TRF-" + Date.now(),
      startedAt: Date.now(),
      active: true
    };
    return { trafficEvents: [...state.trafficEvents, newEvent] };
  }),
  removeTrafficEvent: (id) => set((state) => ({
    trafficEvents: state.trafficEvents.filter((e) => e.id !== id)
  })),
  expireOldEvents: () => set((state) => ({
    trafficEvents: state.trafficEvents.map((e) => {
      if (e.active && Date.now() > e.startedAt + e.duration * 60000) {
        return { ...e, active: false };
      }
      return e;
    })
  })),
  getActiveEvents: () => get().trafficEvents.filter((e) => e.active)
}));
