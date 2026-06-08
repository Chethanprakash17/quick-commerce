"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import OrderTable from '@/components/orders/OrderTable';
import OrderCard from '@/components/orders/OrderCard';
import CreateOrderModal from '@/components/orders/CreateOrderModal';
import { useOrderStore } from '@/lib/store/useOrderStore';
import { useStoreStore } from '@/lib/store/useStoreStore';
import { useRiderStore } from '@/lib/store/useRiderStore';
import { CITY_NODES, buildAdjacencyList, CITY_EDGES } from '@/lib/simulation/cityGraph';
import { selectBestStore, selectBestRider } from '@/lib/algorithms/greedy';
import { dijkstra } from '@/lib/algorithms/dijkstra';
import { poolOrders } from '@/lib/algorithms/pooling';
import { OrderPriority } from '@/lib/types';
import { Plus, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function OrdersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const orders = useOrderStore(state => state.orders);
  const addOrder = useOrderStore(state => state.addOrder);
  const assignOrder = useOrderStore(state => state.assignOrder);
  const stores = useStoreStore(state => state.stores);
  const riders = useRiderStore(state => state.riders);

  const kpis = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      inTransit: orders.filter(o => o.status === 'out_for_delivery').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
    };
  }, [orders]);

  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    const graph = buildAdjacencyList(CITY_EDGES);
    const customers = CITY_NODES.filter(n => n.type === 'customer');
    const priorities: OrderPriority[] = ['low', 'medium', 'high', 'critical'];

    try {
      for (let i = 0; i < 5; i++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        const weight = Math.round((Math.random() * 8 + 1) * 10) / 10;

        const newOrder = addOrder({
          customerId: `C-AUTO-${Date.now()}-${i}`,
          customerName: `Auto Gen ${i+1}`,
          customerNodeId: customer.id,
          items: [{ name: 'Random Item', quantity: 1, weight }],
          totalWeight: weight,
          priority,
          deadline: Date.now() + (Math.random() * 7200000 + 1800000),
          status: 'pending'
        });

        const bestStore = selectBestStore(newOrder, stores, graph, CITY_NODES);
        if (bestStore) {
          const bestRider = selectBestRider(newOrder, bestStore, riders, graph);
          if (bestRider) {
            const routeResult = dijkstra(graph, bestStore.nodeId, customer.id);
            assignOrder(newOrder.id, bestStore.id, bestRider.id, routeResult.path, Math.round(routeResult.travelTime));
          }
        }
      }

      const allPending = useOrderStore.getState().getPendingOrders();
      poolOrders(allPending, riders, graph);

      toast.success("Generated 5 random orders", { description: "Orders have been added to the queue." });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderKanbanColumn = (status: string, title: string, colorClass: string) => {
    const columnOrders = orders.filter(o => o.status === status);

    return (
      <div className="bg-[#0E1628] border border-[#1E2D45] rounded-xl flex flex-col h-full overflow-hidden">
        <div className={`p-3 border-b border-[#1E2D45] flex items-center justify-between ${colorClass}`}>
          <h3 className="font-heading font-semibold text-[#F1F5F9] text-sm">{title}</h3>
          <div className="bg-[#070C18]/50 text-[#F1F5F9] text-xs font-mono px-2 py-0.5 rounded-full">
            {columnOrders.length}
          </div>
        </div>
        <div className="p-3 flex-1 overflow-y-auto">
          <AnimatePresence>
            {columnOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </AnimatePresence>
          {columnOrders.length === 0 && (
            <div className="text-center p-4 text-[#64748B] text-xs">No orders</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="p-6 flex flex-col gap-4 h-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#F1F5F9]">Order Management</h1>
          <p className="text-[#64748B] text-sm mt-1">Real-time order pipeline and fulfillment tracking.</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleAutoGenerate}
            disabled={isGenerating}
            className="bg-[#162035] border-[#1E2D45] text-[#F1F5F9] hover:bg-[#1E2D45]"
          >
            <Zap size={16} className="mr-2 text-[#FACC15]" /> Auto-Generate 5 Orders
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#22C55E] text-[#070C18] hover:bg-[#22C55E]/90 font-medium"
          >
            <Plus size={16} className="mr-2" /> Create Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#0E1628] border border-[#1E2D45] rounded-xl p-4">
          <div className="text-[#64748B] text-xs font-medium mb-1">Total Orders</div>
          <div className="font-heading text-2xl font-bold text-[#F1F5F9]">{kpis.total}</div>
        </div>
        <div className="bg-[#0E1628] border border-[#1E2D45] rounded-xl p-4">
          <div className="text-[#64748B] text-xs font-medium mb-1">Pending</div>
          <div className="font-heading text-2xl font-bold text-[#FACC15]">{kpis.pending}</div>
        </div>
        <div className="bg-[#0E1628] border border-[#1E2D45] rounded-xl p-4">
          <div className="text-[#64748B] text-xs font-medium mb-1">In Transit</div>
          <div className="font-heading text-2xl font-bold text-[#3B82F6]">{kpis.inTransit}</div>
        </div>
        <div className="bg-[#0E1628] border border-[#1E2D45] rounded-xl p-4">
          <div className="text-[#64748B] text-xs font-medium mb-1">Delivered</div>
          <div className="font-heading text-2xl font-bold text-[#22C55E]">{kpis.delivered}</div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <Tabs defaultValue="all" className="flex-1 flex flex-col min-h-0">
          <TabsList className="bg-[#0E1628] border border-[#1E2D45] w-fit mb-4">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#162035] data-[state=active]:text-[#22C55E]">All Orders</TabsTrigger>
            <TabsTrigger value="pipeline" className="data-[state=active]:bg-[#162035] data-[state=active]:text-[#22C55E]">Live Pipeline</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="flex-1 min-h-0 m-0">
            <OrderTable orders={orders} />
          </TabsContent>

          <TabsContent value="pipeline" className="flex-1 min-h-0 m-0">
            <div className="grid grid-cols-4 gap-4 h-full">
              {renderKanbanColumn('pending', 'Pending', 'bg-[#FACC15]/10')}
              {renderKanbanColumn('assigned', 'Assigned', 'bg-[#A855F7]/10')}
              {renderKanbanColumn('out_for_delivery', 'Out for Delivery', 'bg-[#3B82F6]/10')}
              {renderKanbanColumn('delivered', 'Delivered', 'bg-[#22C55E]/10')}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.div>
  );
}
