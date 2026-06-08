import { Order, DarkStore, Rider, CityEdge, CityNode } from "@/lib/types";

export function computePriorityScore(order: Order): number {
  let base = 10;
  if (order.priority === 'critical') base = 100;
  else if (order.priority === 'high') base = 75;
  else if (order.priority === 'medium') base = 40;

  const minutesUntilDeadline = Math.max(0, (order.deadline - Date.now()) / 60000);
  const urgencyBonus = Math.min(30, Math.max(0, 30 - minutesUntilDeadline));
  const weightPenalty = Math.min(10, order.totalWeight / 2);

  let score = base + urgencyBonus - weightPenalty;
  return Math.max(0, Math.min(130, score));
}

export function greedySchedule(orders: Order[]): Order[] {
  return [...orders].sort((a, b) => b.priorityScore - a.priorityScore);
}

export function selectBestStore(order: Order, stores: DarkStore[], graph: Map<string, CityEdge[]>, nodes: CityNode[]): DarkStore | null {
  if (!stores || stores.length === 0) return null;
  return stores[0]; // Simplified for now
}

export function selectBestRider(order: Order, store: DarkStore, riders: Rider[], graph: Map<string, CityEdge[]>): Rider | null {
  const storeRiders = riders.filter(r => r.storeId === store.id && r.status === 'available' && r.capacity >= order.totalWeight);
  if (storeRiders.length === 0) return null;
  return storeRiders[0]; // Simplified for now
}
