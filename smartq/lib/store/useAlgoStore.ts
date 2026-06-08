import { create } from "zustand";
import { AlgoStep } from "@/lib/types";

interface AlgoStore {
  selectedAlgorithm: string | null;
  isRunning: boolean;
  currentStep: number;
  totalSteps: number;
  steps: AlgoStep[];
  result: unknown;
  startNodeId: string | null;
  endNodeId: string | null;
  setAlgorithm: (algo: string) => void;
  setNodes: (startNodeId: string | null, endNodeId?: string | null) => void;
  runAlgorithm: (algoFn: () => { steps: AlgoStep[], [key: string]: unknown }) => void;
  stepForward: () => void;
  stepBackward: () => void;
  resetVisualization: () => void;
}

export const useAlgoStore = create<AlgoStore>((set, get) => ({
  selectedAlgorithm: null,
  isRunning: false,
  currentStep: 0,
  totalSteps: 0,
  steps: [],
  result: null,
  startNodeId: null,
  endNodeId: null,
  setAlgorithm: (algo) => set({
    selectedAlgorithm: algo,
    isRunning: false,
    currentStep: 0,
    totalSteps: 0,
    steps: [],
    result: null,
    startNodeId: null,
    endNodeId: null
  }),
  setNodes: (startNodeId, endNodeId = null) => set({ startNodeId, endNodeId }),
  runAlgorithm: (algoFn) => {
    set({ isRunning: true });
    try {
      const res = algoFn();
      set({
        steps: res.steps || [],
        totalSteps: res.steps?.length || 0,
        result: res,
        currentStep: 0,
        isRunning: false
      });
    } catch (e) {
      console.error(e);
      set({ isRunning: false });
    }
  },
  stepForward: () => set((state) => ({
    currentStep: state.currentStep < state.totalSteps - 1 ? state.currentStep + 1 : state.currentStep
  })),
  stepBackward: () => set((state) => ({
    currentStep: state.currentStep > 0 ? state.currentStep - 1 : state.currentStep
  })),
  resetVisualization: () => set({ currentStep: 0, steps: [], result: null, isRunning: false })
}));
