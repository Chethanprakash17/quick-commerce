import React from "react";
import { Order } from "@/lib/types";

export default function OrderCard({ order }: { order: Order }) {
  return <div>Order: {order.id}</div>;
}
