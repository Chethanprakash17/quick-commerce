import { create } from "zustand";
import { Order, OrderStatus } from "@/lib/types";
import { INITIAL_ORDERS } from "@/lib/simulation/seedData";
import { computePriorityScore } from "@/lib/algorithms/greedy";

interface OrderStore {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "placedAt" | "priorityScore">) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  assignOrder: (id: string, storeId: string, riderId: string, route: string[], etaMinutes: number) => void;
  cancelOrder: (id: string) => void;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getPendingOrders: () => Order[];
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: INITIAL_ORDERS,
  addOrder: (order) => {
    const id = "ORD-" + Date.now();
    const placedAt = Date.now();
    const newOrder: Order = {
      ...order,
      id,
      placedAt,
      priorityScore: computePriorityScore({ ...order, id, placedAt, priorityScore: 0 } as Order)
    };
    set((state) => ({ orders: [...state.orders, newOrder] }));
    return newOrder;
  },
  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o))
  })),
  assignOrder: (id, storeId, riderId, route, etaMinutes) => set((state) => ({
    orders: state.orders.map((o) => (o.id === id ? { ...o, assignedStoreId: storeId, assignedRiderId: riderId, route, etaMinutes, status: "assigned" } : o))
  })),
  cancelOrder: (id) => set((state) => ({
    orders: state.orders.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o))
  })),
  getOrdersByStatus: (status) => get().orders.filter((o) => o.status === status),
  getPendingOrders: () => get().orders.filter((o) => o.status === "pending")
}));
