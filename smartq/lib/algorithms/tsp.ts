import { CityEdge, AlgoStep } from "@/lib/types";

export function nearestNeighborTSP(startNodeId: string, stopNodeIds: string[], graph: Map<string, CityEdge[]>): { orderedStops: string[]; totalDistance: number; steps: AlgoStep[] } {
  return { orderedStops: [startNodeId, ...stopNodeIds], totalDistance: 0, steps: [] };
}
