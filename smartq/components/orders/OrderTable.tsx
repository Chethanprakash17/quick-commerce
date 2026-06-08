import React from "react";
import { Order } from "@/lib/types";

export default function OrderTable({ orders }: { orders: Order[] }) {
  return <div>OrderTable: {orders.length} orders</div>;
}
