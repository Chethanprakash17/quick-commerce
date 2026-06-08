export type NodeType = 'store' | 'warehouse' | 'hub' | 'customer' | 'junction';

export interface CityNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
  lat?: number;
  lng?: number;
}

export interface CityEdge {
  id: string;
  from: string;
  to: string;
  distance: number;
  baseTravelTime: number;
  currentTravelTime: number;
  trafficMultiplier: number;
  isBlocked: boolean;
}

export type TrafficType = 'congestion' | 'accident' | 'roadblock' | 'construction';

export interface TrafficEvent {
  id: string;
  edgeId: string;
  type: TrafficType;
  multiplier: number;
  startedAt: number;
  duration: number;
  active: boolean;
}

export type OrderPriority = 'low' | 'medium' | 'high' | 'critical';
export type OrderStatus = 'pending' | 'assigned' | 'picking' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
  name: string;
  quantity: number;
  weight: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerNodeId: string;
  items: OrderItem[];
  totalWeight: number;
  priority: OrderPriority;
  deadline: number;
  status: OrderStatus;
  assignedStoreId?: string;
  assignedRiderId?: string;
  pooledWithOrderIds?: string[];
  route?: string[];
  etaMinutes?: number;
  distanceKm?: number;
  placedAt: number;
  deliveredAt?: number;
  priorityScore: number;
}

export interface StoreInventory {
  [itemName: string]: number;
}

export interface DarkStore {
  id: string;
  name: string;
  nodeId: string;
  inventory: StoreInventory;
  capacity: number;
  activeOrders: number;
  availableRiderIds: string[];
  fulfillmentRate: number;
  totalDelivered: number;
}

export type VehicleType = 'bicycle' | 'scooter' | 'bike';
export type RiderStatus = 'available' | 'assigned' | 'delivering' | 'returning' | 'offline';

export interface Rider {
  id: string;
  name: string;
  vehicleType: VehicleType;
  capacity: number;
  currentNodeId: string;
  status: RiderStatus;
  assignedOrderIds: string[];
  currentRoute: string[];
  currentRouteIndex: number;
  totalDeliveries: number;
  rating: number;
  storeId: string;
}

export interface AlgoStep {
  stepNumber: number;
  description?: string;
  highlightNodes?: string[];
  highlightEdges?: string[];
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface DijkstraResult {
  path: string[];
  distance: number;
  travelTime: number;
  steps: AlgoStep[];
  [key: string]: unknown;
}

export interface KnapsackStep extends AlgoStep {
  stepNumber: number;
  item: string;
  weight: number;
  included: boolean;
  remainingCapacity: number;
  dpTable?: number[][];
}

export interface KnapsackResult {
  selectedOrderIds: string[];
  totalWeight: number;
  totalValue: number;
  utilizationPercent: number;
  steps: KnapsackStep[];
  [key: string]: unknown;
}

export interface OrderPool {
  id: string;
  orderIds: string[];
  riderId?: string;
  route: string[];
  totalDistance: number;
}

export interface PoolingResult {
  pools: OrderPool[];
  distanceSaved: number;
  timeSaved: number;
  efficiencyGain: number;
}

export interface KPISnapshot {
  ordersToday: number;
  ordersDelivered: number;
  ordersPending: number;
  ordersInTransit: number;
  avgDeliveryTimeMinutes: number;
  routeEfficiencyPercent: number;
  fuelSavingsPercent: number;
  riderUtilizationPercent: number;
  storeUtilizationPercent: number;
  poolingEfficiencyPercent: number;
  optimizationScore: number;
}

export interface SimulationTickResult {
  newOrders: Order[];
  updatedOrders: Order[];
  riderMovements: { riderId: string; newNodeId: string }[];
  algoLog: string[];
  deliveries: string[];
}
