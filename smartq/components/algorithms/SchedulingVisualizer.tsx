import React, { useState } from 'react';
import { useOrderStore } from '@/lib/store/useOrderStore';
import { computePriorityScore, greedySchedule } from '@/lib/algorithms/greedy';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function SchedulingVisualizer() {
  const pendingOrders = useOrderStore(state => state.getPendingOrders());
  const scoredOrders = pendingOrders.map(o => ({ ...o, priorityScore: computePriorityScore(o) }));

  const [orders, setOrders] = useState(scoredOrders);

  const handleSort = () => {
    setOrders(greedySchedule(orders));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-heading font-semibold text-lg text-[#F1F5F9]">Greedy Priority Scheduling</h3>
        <Button onClick={handleSort} className="bg-[#22C55E] text-[#070C18] hover:bg-[#22C55E]/90">
          Run Greedy Sort
        </Button>
      </div>

      <div className="bg-[#0E1628] rounded-xl border border-[#1E2D45] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b-[#1E2D45]">
              <TableHead className="text-[#64748B]">Order ID</TableHead>
              <TableHead className="text-[#64748B]">Priority</TableHead>
              <TableHead className="text-[#64748B]">Weight</TableHead>
              <TableHead className="text-[#64748B]">Deadline</TableHead>
              <TableHead className="text-[#64748B]">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => {
              const isTop3 = index < 3;
              return (
                <TableRow
                  key={order.id}
                  className={`border-b-[#1E2D45] ${isTop3 ? 'bg-[#22C55E]/10' : ''}`}
                >
                  <TableCell className="font-mono text-[#F1F5F9]">{order.id}</TableCell>
                  <TableCell className="text-[#F1F5F9] capitalize">{order.priority}</TableCell>
                  <TableCell className="text-[#F1F5F9]">{order.totalWeight}kg</TableCell>
                  <TableCell className="text-[#F1F5F9]">{new Date(order.deadline).toLocaleTimeString()}</TableCell>
                  <TableCell className="font-mono text-[#22C55E]">{Math.round(order.priorityScore)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
