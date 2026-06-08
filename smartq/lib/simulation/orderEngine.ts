import { SimulationTickResult } from "@/lib/types";

export function runSimulationTick(orders: unknown[], riders: unknown[], stores: unknown[], trafficEvents: unknown[], graph: unknown): SimulationTickResult {
  return { newOrders: [], updatedOrders: [], riderMovements: [], algoLog: [], deliveries: [] };
}
