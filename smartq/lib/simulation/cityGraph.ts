import { CityNode, CityEdge } from "@/lib/types";

export const CITY_NODES: CityNode[] = [
  { id: 'store-a', label: 'Store Alpha', type: 'store', x: 150, y: 150 },
  { id: 'store-b', label: 'Store Beta', type: 'store', x: 500, y: 100 },
  { id: 'store-c', label: 'Store Gamma', type: 'store', x: 750, y: 200 },
  { id: 'wh-central', label: 'Central Warehouse', type: 'warehouse', x: 420, y: 300 },
  { id: 'hub-north', label: 'North Hub', type: 'hub', x: 300, y: 80 },
  { id: 'hub-south', label: 'South Hub', type: 'hub', x: 600, y: 450 },
  { id: 'jn-1', label: 'Junction 1', type: 'junction', x: 280, y: 220 },
  { id: 'jn-2', label: 'Junction 2', type: 'junction', x: 480, y: 200 },
  { id: 'jn-3', label: 'Junction 3', type: 'junction', x: 620, y: 300 },
  { id: 'jn-4', label: 'Junction 4', type: 'junction', x: 350, y: 420 },
  { id: 'jn-5', label: 'Junction 5', type: 'junction', x: 180, y: 370 },
  { id: 'cz-1', label: 'Zone Maple', type: 'customer', x: 100, y: 250 },
  { id: 'cz-2', label: 'Zone Cedar', type: 'customer', x: 220, y: 320 },
  { id: 'cz-3', label: 'Zone Oak', type: 'customer', x: 380, y: 150 },
  { id: 'cz-4', label: 'Zone Pine', type: 'customer', x: 560, y: 180 },
  { id: 'cz-5', label: 'Zone Birch', type: 'customer', x: 680, y: 130 },
  { id: 'cz-6', label: 'Zone Elm', type: 'customer', x: 700, y: 370 },
  { id: 'cz-7', label: 'Zone Fern', type: 'customer', x: 450, y: 480 },
  { id: 'cz-8', label: 'Zone Grove', type: 'customer', x: 250, y: 480 }
];

export const CITY_EDGES: CityEdge[] = [
  { id: 'store-a-hub-north', from: 'store-a', to: 'hub-north', distance: 1.5, baseTravelTime: 3, currentTravelTime: 3, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'store-a-jn-1', from: 'store-a', to: 'jn-1', distance: 1.2, baseTravelTime: 2.4, currentTravelTime: 2.4, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'store-a-cz-1', from: 'store-a', to: 'cz-1', distance: 1.8, baseTravelTime: 3.6, currentTravelTime: 3.6, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'hub-north-store-b', from: 'hub-north', to: 'store-b', distance: 2.0, baseTravelTime: 4.0, currentTravelTime: 4.0, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'hub-north-cz-3', from: 'hub-north', to: 'cz-3', distance: 1.5, baseTravelTime: 3.0, currentTravelTime: 3.0, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'store-b-jn-2', from: 'store-b', to: 'jn-2', distance: 1.0, baseTravelTime: 2.0, currentTravelTime: 2.0, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'store-b-cz-3', from: 'store-b', to: 'cz-3', distance: 1.3, baseTravelTime: 2.6, currentTravelTime: 2.6, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'store-b-cz-4', from: 'store-b', to: 'cz-4', distance: 1.4, baseTravelTime: 2.8, currentTravelTime: 2.8, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'store-c-cz-5', from: 'store-c', to: 'cz-5', distance: 1.6, baseTravelTime: 3.2, currentTravelTime: 3.2, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'store-c-jn-3', from: 'store-c', to: 'jn-3', distance: 1.7, baseTravelTime: 3.4, currentTravelTime: 3.4, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'jn-1-wh-central', from: 'jn-1', to: 'wh-central', distance: 2.2, baseTravelTime: 4.4, currentTravelTime: 4.4, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'jn-1-cz-2', from: 'jn-1', to: 'cz-2', distance: 1.1, baseTravelTime: 2.2, currentTravelTime: 2.2, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'jn-1-jn-5', from: 'jn-1', to: 'jn-5', distance: 1.5, baseTravelTime: 3.0, currentTravelTime: 3.0, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'jn-2-wh-central', from: 'jn-2', to: 'wh-central', distance: 1.9, baseTravelTime: 3.8, currentTravelTime: 3.8, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'jn-2-cz-4', from: 'jn-2', to: 'cz-4', distance: 1.2, baseTravelTime: 2.4, currentTravelTime: 2.4, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'jn-3-cz-6', from: 'jn-3', to: 'cz-6', distance: 1.3, baseTravelTime: 2.6, currentTravelTime: 2.6, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'jn-3-hub-south', from: 'jn-3', to: 'hub-south', distance: 1.8, baseTravelTime: 3.6, currentTravelTime: 3.6, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'jn-4-wh-central', from: 'jn-4', to: 'wh-central', distance: 1.7, baseTravelTime: 3.4, currentTravelTime: 3.4, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'jn-4-cz-7', from: 'jn-4', to: 'cz-7', distance: 1.4, baseTravelTime: 2.8, currentTravelTime: 2.8, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'jn-4-cz-8', from: 'jn-4', to: 'cz-8', distance: 1.6, baseTravelTime: 3.2, currentTravelTime: 3.2, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'jn-4-hub-south', from: 'jn-4', to: 'hub-south', distance: 2.1, baseTravelTime: 4.2, currentTravelTime: 4.2, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'jn-5-cz-2', from: 'jn-5', to: 'cz-2', distance: 0.9, baseTravelTime: 1.8, currentTravelTime: 1.8, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'jn-5-cz-8', from: 'jn-5', to: 'cz-8', distance: 1.2, baseTravelTime: 2.4, currentTravelTime: 2.4, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'hub-south-cz-7', from: 'hub-south', to: 'cz-7', distance: 1.5, baseTravelTime: 3.0, currentTravelTime: 3.0, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'cz-4-cz-5', from: 'cz-4', to: 'cz-5', distance: 1.8, baseTravelTime: 3.6, currentTravelTime: 3.6, trafficMultiplier: 1.0, isBlocked: false },
  { id: 'cz-1-jn-5', from: 'cz-1', to: 'jn-5', distance: 1.4, baseTravelTime: 2.8, currentTravelTime: 2.8, trafficMultiplier: 1.0, isBlocked: false }
];

export function buildAdjacencyList(edges: CityEdge[]): Map<string, CityEdge[]> {
  const map = new Map<string, CityEdge[]>();
  for (const edge of edges) {
    if (!map.has(edge.from)) map.set(edge.from, []);
    map.get(edge.from)!.push(edge);

    // bidirectional
    const reverse = { ...edge, id: edge.to + '-' + edge.from, from: edge.to, to: edge.from };
    if (!map.has(edge.to)) map.set(edge.to, []);
    map.get(edge.to)!.push(reverse);
  }
  return map;
}

export function getNodeById(id: string): CityNode | undefined {
  return CITY_NODES.find(n => n.id === id);
}

export function getEdgeBetween(from: string, to: string, edges: CityEdge[]): CityEdge | undefined {
  return edges.find(e => (e.from === from && e.to === to) || (e.from === to && e.to === from));
}
