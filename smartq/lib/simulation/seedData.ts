import { DarkStore, Rider, Order } from "@/lib/types";

export const INITIAL_STORES: DarkStore[] = [
  { id: 'store-a', name: 'Store Alpha', nodeId: 'store-a', capacity: 20, activeOrders: 4, fulfillmentRate: 94, totalDelivered: 127, availableRiderIds: ['rider-1','rider-2','rider-3'], inventory: { milk:50, bread:40, eggs:80, butter:20, rice:60, water:100, juice:35, chips:45 } },
  { id: 'store-b', name: 'Store Beta', nodeId: 'store-b', capacity: 15, activeOrders: 6, fulfillmentRate: 89, totalDelivered: 98, availableRiderIds: ['rider-4','rider-5','rider-6'], inventory: { milk:30, bread:25, eggs:60, butter:15, rice:40, water:80, juice:20, chips:30 } },
  { id: 'store-c', name: 'Store Gamma', nodeId: 'store-c', capacity: 10, activeOrders: 2, fulfillmentRate: 97, totalDelivered: 64, availableRiderIds: ['rider-7','rider-8'], inventory: { milk:20, bread:15, eggs:40, butter:10, rice:30, water:50, juice:15, chips:20 } }
];

export const INITIAL_RIDERS: Rider[] = [
  { id: 'rider-1', name: 'Arjun', vehicleType: 'scooter', capacity: 15, status: 'delivering', currentNodeId: 'jn-1', currentRoute: ['store-a','jn-1','cz-2'], currentRouteIndex: 1, totalDeliveries: 43, rating: 4.8, storeId: 'store-a', assignedOrderIds: ['ORD-001'] },
  { id: 'rider-2', name: 'Priya', vehicleType: 'bicycle', capacity: 10, status: 'available', currentNodeId: 'store-a', currentRoute: [], currentRouteIndex: 0, totalDeliveries: 31, rating: 4.6, storeId: 'store-a', assignedOrderIds: [] },
  { id: 'rider-3', name: 'Rahul', vehicleType: 'bike', capacity: 25, status: 'available', currentNodeId: 'store-a', currentRoute: [], currentRouteIndex: 0, totalDeliveries: 67, rating: 4.9, storeId: 'store-a', assignedOrderIds: [] },
  { id: 'rider-4', name: 'Sneha', vehicleType: 'scooter', capacity: 15, status: 'delivering', currentNodeId: 'jn-2', currentRoute: ['store-b','jn-2','cz-4'], currentRouteIndex: 1, totalDeliveries: 28, rating: 4.5, storeId: 'store-b', assignedOrderIds: ['ORD-003'] },
  { id: 'rider-5', name: 'Vikram', vehicleType: 'bike', capacity: 25, status: 'available', currentNodeId: 'store-b', currentRoute: [], currentRouteIndex: 0, totalDeliveries: 54, rating: 4.7, storeId: 'store-b', assignedOrderIds: [] },
  { id: 'rider-6', name: 'Meera', vehicleType: 'scooter', capacity: 15, status: 'returning', currentNodeId: 'cz-3', currentRoute: [], currentRouteIndex: 0, totalDeliveries: 19, rating: 4.4, storeId: 'store-b', assignedOrderIds: [] },
  { id: 'rider-7', name: 'Karan', vehicleType: 'scooter', capacity: 15, status: 'delivering', currentNodeId: 'store-c', currentRoute: ['store-c','cz-5'], currentRouteIndex: 0, totalDeliveries: 38, rating: 4.8, storeId: 'store-c', assignedOrderIds: ['ORD-005'] },
  { id: 'rider-8', name: 'Divya', vehicleType: 'bicycle', capacity: 10, status: 'available', currentNodeId: 'store-c', currentRoute: [], currentRouteIndex: 0, totalDeliveries: 22, rating: 4.6, storeId: 'store-c', assignedOrderIds: [] }
];

export const INITIAL_ORDERS: Order[] = [
  { id: 'ORD-001', customerId: 'C1', customerName: 'Alice', customerNodeId: 'cz-2', items: [], totalWeight: 4.5, priority: 'critical', deadline: Date.now() + 300000, status: 'out_for_delivery', assignedStoreId: 'store-a', assignedRiderId: 'rider-1', route: ['store-a','jn-1','cz-2'], etaMinutes: 4, placedAt: Date.now() - 600000, priorityScore: 118 },
  { id: 'ORD-002', customerId: 'C2', customerName: 'Bob', customerNodeId: 'cz-4', items: [], totalWeight: 8.0, priority: 'high', deadline: Date.now() + 1800000, status: 'pending', placedAt: Date.now() - 300000, priorityScore: 82 },
  { id: 'ORD-003', customerId: 'C3', customerName: 'Charlie', customerNodeId: 'cz-3', items: [], totalWeight: 3.2, priority: 'medium', deadline: Date.now() + 2400000, status: 'assigned', assignedStoreId: 'store-b', assignedRiderId: 'rider-4', route: ['store-b','jn-2','cz-3'], placedAt: Date.now() - 900000, priorityScore: 51 },
  { id: 'ORD-004', customerId: 'C4', customerName: 'David', customerNodeId: 'cz-7', items: [], totalWeight: 12.0, priority: 'low', deadline: Date.now() + 7200000, status: 'pending', placedAt: Date.now() - 100000, priorityScore: 18 },
  { id: 'ORD-005', customerId: 'C5', customerName: 'Eve', customerNodeId: 'cz-5', items: [], totalWeight: 6.5, priority: 'high', deadline: Date.now() + 1200000, status: 'out_for_delivery', assignedStoreId: 'store-c', assignedRiderId: 'rider-7', route: ['store-c','cz-5'], placedAt: Date.now() - 400000, priorityScore: 88 },
  { id: 'ORD-006', customerId: 'C6', customerName: 'Frank', customerNodeId: 'cz-1', items: [], totalWeight: 2.0, priority: 'critical', deadline: Date.now() + 200000, status: 'pending', placedAt: Date.now() - 500000, priorityScore: 125 },
  { id: 'ORD-007', customerId: 'C7', customerName: 'Grace', customerNodeId: 'cz-8', items: [], totalWeight: 5.0, priority: 'medium', deadline: Date.now() + 3600000, status: 'delivered', placedAt: Date.now() - 2000000, deliveredAt: Date.now() - 900000, priorityScore: 45 },
  { id: 'ORD-008', customerId: 'C8', customerName: 'Heidi', customerNodeId: 'cz-2', items: [], totalWeight: 7.5, priority: 'high', deadline: Date.now() + 1500000, status: 'pending', placedAt: Date.now() - 350000, priorityScore: 79 },
  { id: 'ORD-009', customerId: 'C9', customerName: 'Ivan', customerNodeId: 'cz-6', items: [], totalWeight: 9.0, priority: 'low', deadline: Date.now() + 5400000, status: 'pending', placedAt: Date.now() - 150000, priorityScore: 12 },
  { id: 'ORD-010', customerId: 'C10', customerName: 'Judy', customerNodeId: 'cz-7', items: [], totalWeight: 4.0, priority: 'medium', deadline: Date.now() + 3000000, status: 'assigned', assignedStoreId: 'store-a', placedAt: Date.now() - 600000, priorityScore: 48 },
  { id: 'ORD-011', customerId: 'C11', customerName: 'Mallory', customerNodeId: 'cz-3', items: [], totalWeight: 6.0, priority: 'high', deadline: Date.now() + 1000000, status: 'pending', placedAt: Date.now() - 250000, priorityScore: 85 },
  { id: 'ORD-012', customerId: 'C12', customerName: 'Niaj', customerNodeId: 'cz-4', items: [], totalWeight: 3.5, priority: 'critical', deadline: Date.now() + 400000, status: 'pending', placedAt: Date.now() - 550000, priorityScore: 122 }
];
