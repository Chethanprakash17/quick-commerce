"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, Truck, Clock, Timer, Cpu } from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import LiveOrderFeed from '@/components/dashboard/LiveOrderFeed';
import SystemStatus from '@/components/dashboard/SystemStatus';
import CityMap from '@/components/map/CityMap';
import { useOrderStore } from '@/lib/store/useOrderStore';
import { useStoreStore } from '@/lib/store/useStoreStore';

export default function DashboardPage() {
  const orders = useOrderStore(state => state.orders);
  const stores = useStoreStore(state => state.stores);

  const kpis = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const ordersToday = orders.filter(o => o.placedAt >= today);
    const delivered = ordersToday.filter(o => o.status === 'delivered');
    const inTransit = orders.filter(o => o.status === 'out_for_delivery');
    const pending = orders.filter(o => o.status === 'pending');

    let totalDeliveryTime = 0;
    delivered.forEach(o => {
      if (o.deliveredAt) {
        totalDeliveryTime += (o.deliveredAt - o.placedAt) / 60000;
      }
    });
    const avgDeliveryTime = delivered.length > 0 ? totalDeliveryTime / delivered.length : 0;

    const avgFulfillment = stores.reduce((acc, s) => acc + s.fulfillmentRate, 0) / (stores.length || 1);

    return {
      ordersToday: ordersToday.length,
      deliveredPercent: ordersToday.length > 0 ? (delivered.length / ordersToday.length) * 100 : 0,
      inTransit: inTransit.length,
      pending: pending.length,
      avgDeliveryTime,
      optimizationScore: avgFulfillment
    };
  }, [orders, stores]);

  return (
    <motion.div
      className="p-6 flex flex-col gap-4 h-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-6 gap-4">
        <KPICard
          title="Orders Today"
          value={kpis.ordersToday}
          icon={TrendingUp}
          colorClass="text-[#22C55E]"
          trend="12%" trendUp={true}
        />
        <KPICard
          title="Delivered Today"
          value={kpis.deliveredPercent}
          icon={CheckCircle}
          colorClass="text-[#22C55E]"
          isPercentage={true}
        />
        <KPICard
          title="In Transit"
          value={kpis.inTransit}
          icon={Truck}
          colorClass="text-[#3B82F6]"
        />
        <KPICard
          title="Pending"
          value={kpis.pending}
          icon={Clock}
          colorClass="text-[#FACC15]"
        />
        <KPICard
          title="Avg Delivery Time"
          value={kpis.avgDeliveryTime}
          icon={Timer}
          colorClass="text-[#F1F5F9]"
          isTimer={true}
          trend="2m" trendUp={false}
        />
        <KPICard
          title="Optimization Score"
          value={kpis.optimizationScore}
          icon={Cpu}
          colorClass="text-[#22C55E]"
          showProgressRing={true}
          progressValue={kpis.optimizationScore}
        />
      </div>

      <div className="grid grid-cols-5 gap-4 flex-1 min-h-0">
        <div className="col-span-3 flex flex-col gap-4">
          <div className="bg-[#0E1628] border border-[#1E2D45] rounded-xl p-4 flex-1 flex flex-col min-h-0">
            <h3 className="font-heading font-semibold text-[#F1F5F9] mb-3">Nexus City Live Operations</h3>
            <div className="flex-1 rounded-lg overflow-hidden border border-[#1E2D45]">
              <CityMap showRiderLabels={true} />
            </div>
          </div>
          <LiveOrderFeed />
        </div>

        <div className="col-span-2">
          <SystemStatus />
        </div>
      </div>
    </motion.div>
  );
}
