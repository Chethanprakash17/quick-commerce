import { create } from "zustand";

interface SimStore {
  isSimulationRunning: boolean;
  simulationSpeed: number;
  tick: number;
  startSimulation: () => void;
  stopSimulation: () => void;
  setSpeed: (speed: number) => void;
  incrementTick: () => void;
}

export const useSimStore = create<SimStore>((set) => ({
  isSimulationRunning: false,
  simulationSpeed: 1,
  tick: 0,
  startSimulation: () => set({ isSimulationRunning: true }),
  stopSimulation: () => set({ isSimulationRunning: false }),
  setSpeed: (speed) => set({ simulationSpeed: speed }),
  incrementTick: () => set((state) => ({ tick: state.tick + 1 }))
}));
