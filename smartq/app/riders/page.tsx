"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRiderStore } from '@/lib/store/useRiderStore';
import { useOrderStore } from '@/lib/store/useOrderStore';
import { Rider } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Route, Star, Package } from 'lucide-react';
import CityMap from '@/components/map/CityMap';

export default function RidersPage() {
  const riders = useRiderStore(state => state.riders);
  const orders = useOrderStore(state => state.orders);

  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [highlightedRiderId, setHighlightedRiderId] = useState<string | null>(null);

  const stats = {
    total: riders.length,
    available: riders.filter(r => r.status === 'available').length,
    delivering: riders.filter(r => r.status === 'delivering').length,
    offline: riders.filter(r => r.status === 'offline').length,
  };

  const getVehicleColor = (type: string) => {
    switch(type) {
      case 'bicycle': return 'bg-[#64748B]/10 text-[#64748B] border-[#64748B]/20';
      case 'scooter': return 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20';
      case 'bike': return 'bg-[#A855F7]/10 text-[#A855F7] border-[#A855F7]/20';
      default: return 'bg-[#64748B]/10 text-[#64748B]';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20';
      case 'delivering': return 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20';
      case 'returning': return 'bg-[#FACC15]/10 text-[#FACC15] border-[#FACC15]/20';
      case 'assigned': return 'bg-[#A855F7]/10 text-[#A855F7] border-[#A855F7]/20';
      default: return 'bg-[#64748B]/10 text-[#64748B] border-[#64748B]/20';
    }
  };

  return (
    <motion.div
      className="p-6 h-full flex flex-col overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-[#F1F5F9]">Rider Operations</h1>
        <p className="text-[#64748B] text-sm mt-1">Fleet tracking assignments and performance.</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0E1628] border border-[#1E2D45] rounded-xl p-4">
          <div className="text-[#64748B] text-xs font-medium mb-1">Total Riders</div>
          <div className="font-heading text-2xl font-bold text-[#F1F5F9]">{stats.total}</div>
        </div>
        <div className="bg-[#0E1628] border border-[#1E2D45] rounded-xl p-4">
          <div className="text-[#64748B] text-xs font-medium mb-1">Available</div>
          <div className="font-heading text-2xl font-bold text-[#22C55E]">{stats.available}</div>
        </div>
        <div className="bg-[#0E1628] border border-[#1E2D45] rounded-xl p-4">
          <div className="text-[#64748B] text-xs font-medium mb-1">Delivering</div>
          <div className="font-heading text-2xl font-bold text-[#3B82F6]">{stats.delivering}</div>
        </div>
        <div className="bg-[#0E1628] border border-[#1E2D45] rounded-xl p-4">
          <div className="text-[#64748B] text-xs font-medium mb-1">Offline</div>
          <div className="font-heading text-2xl font-bold text-[#64748B]">{stats.offline}</div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="w-[60%] flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
          <div className="grid grid-cols-2 gap-4">
            {riders.map(rider => {
              const assignedWeight = orders
                .filter(o => rider.assignedOrderIds.includes(o.id) && o.status !== 'delivered')
                .reduce((sum, o) => sum + o.totalWeight, 0);

              const loadPercent = Math.min(100, (assignedWeight / rider.capacity) * 100);
              const isSelected = highlightedRiderId === rider.id;

              return (
                <motion.div
                  key={rider.id}
                  className={`bg-[#0E1628] border ${isSelected ? 'border-[#22C55E]' : 'border-[#1E2D45]'} hover:border-[#22C55E] rounded-xl p-4 cursor-pointer transition-colors flex flex-col relative overflow-hidden`}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedRider(rider)}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#22C55E]/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                  )}

                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-heading font-bold
                        ${rider.status === 'delivering' ? 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30' :
                          rider.status === 'available' ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30' :
                          'bg-[#64748B]/20 text-[#F1F5F9] border border-[#64748B]/30'}`}
                      >
                        {rider.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#F1F5F9]">{rider.name}</div>
                        <div className="font-mono text-[#64748B] text-[10px]">{rider.id}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className={`rounded-full text-[9px] uppercase px-2 py-0 border ${getStatusColor(rider.status)}`}>
                      {rider.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className={`rounded-full text-[9px] uppercase px-2 py-0 border ${getVehicleColor(rider.vehicleType)}`}>
                      {rider.vehicleType}
                    </Badge>
                    <div className="flex items-center gap-1 text-[10px] text-[#FACC15] bg-[#FACC15]/10 px-1.5 py-0.5 rounded-sm border border-[#FACC15]/20">
                      <Star size={10} fill="currentColor" />
                      <span>{rider.rating}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-[#64748B]">Capacity Load</span>
                      <span className="text-[#F1F5F9] font-mono">{assignedWeight.toFixed(1)}/{rider.capacity}kg</span>
                    </div>
                    <div className="h-1 w-full bg-[#162035] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${loadPercent > 90 ? 'bg-[#EF4444]' : loadPercent > 70 ? 'bg-[#FACC15]' : 'bg-[#22C55E]'}`}
                        style={{ width: `${loadPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#1E2D45] pt-3 mt-auto">
                    <div className="text-[10px]">
                      {rider.assignedOrderIds.length > 0 ? (
                         <span className="text-[#F1F5F9] flex items-center gap-1">
                           <Package size={10} className="text-[#3B82F6]" /> {rider.assignedOrderIds.length} Assigned
                         </span>
                      ) : (
                         <span className="text-[#64748B]">Available for dispatch</span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setHighlightedRiderId(rider.id === highlightedRiderId ? null : rider.id);
                      }}
                      className={`h-6 text-[10px] ${isSelected ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#162035] text-[#F1F5F9] hover:bg-[#22C55E]/10 hover:text-[#22C55E]'}`}
                    >
                      <MapPin size={10} className="mr-1" /> Track
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="w-[40%] bg-[#0E1628] border border-[#1E2D45] rounded-xl overflow-hidden flex flex-col relative">
           <div className="absolute top-4 left-4 z-10 bg-[#0E1628]/80 backdrop-blur-sm border border-[#1E2D45] px-3 py-1.5 rounded-lg text-xs font-medium text-[#F1F5F9]">
             Live Tracker
           </div>
           <CityMap
             showRiderLabels={true}
             highlightedRoute={highlightedRiderId ? riders.find(r => r.id === highlightedRiderId)?.currentRoute : []}
           />
        </div>
      </div>

      <Dialog open={!!selectedRider} onOpenChange={(open) => !open && setSelectedRider(null)}>
        <DialogContent className="bg-[#0E1628] border-[#1E2D45] text-[#F1F5F9] max-w-lg">
          {selectedRider && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <DialogTitle className="font-heading text-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center border border-[#3B82F6]/30">
                      {selectedRider.name.charAt(0)}
                    </div>
                    <div>
                      <div>{selectedRider.name}</div>
                      <div className="font-mono text-[#64748B] text-xs font-normal">{selectedRider.id}</div>
                    </div>
                  </DialogTitle>
                  <Badge variant="outline" className={`rounded-full text-[10px] uppercase px-2 py-0 border ${getStatusColor(selectedRider.status)}`}>
                    {selectedRider.status}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-4 py-4 border-y border-[#1E2D45] mt-2">
                <div className="text-center">
                  <div className="text-[10px] text-[#64748B] uppercase font-medium mb-1">Deliveries Today</div>
                  <div className="font-mono text-xl font-semibold text-[#F1F5F9]">{Math.floor(selectedRider.totalDeliveries / 5)}</div>
                </div>
                <div className="text-center border-l border-[#1E2D45]">
                  <div className="text-[10px] text-[#64748B] uppercase font-medium mb-1">Avg Time</div>
                  <div className="font-mono text-xl font-semibold text-[#F1F5F9]">14m</div>
                </div>
                <div className="text-center border-l border-[#1E2D45]">
                  <div className="text-[10px] text-[#64748B] uppercase font-medium mb-1">Rating</div>
                  <div className="font-mono text-xl font-semibold text-[#FACC15] flex justify-center items-center gap-1">
                    {selectedRider.rating} <Star size={14} fill="currentColor" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 py-2">
                <div>
                  <h3 className="text-xs font-medium text-[#64748B] uppercase mb-2 flex items-center gap-1.5">
                    <Route size={14} /> Current Route
                  </h3>
                  {selectedRider.currentRoute.length > 0 ? (
                    <div className="bg-[#162035] rounded-lg p-3 border border-[#1E2D45]">
                      <div className="flex items-center gap-2 flex-wrap text-sm font-mono text-[#F1F5F9]">
                        {selectedRider.currentRoute.map((nodeId, i) => (
                          <React.Fragment key={i}>
                            <span className={i === selectedRider.currentRouteIndex ? "text-[#22C55E]" : ""}>
                              {nodeId}
                            </span>
                            {i < selectedRider.currentRoute.length - 1 && (
                              <span className="text-[#64748B] text-xs">→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#162035] rounded-lg p-3 border border-[#1E2D45] text-sm text-[#64748B] italic">
                      No active route assigned.
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-medium text-[#64748B] uppercase mb-2 flex items-center gap-1.5">
                    <Package size={14} /> Active Assignments
                  </h3>
                  <div className="space-y-2">
                    {selectedRider.assignedOrderIds.length > 0 ? (
                      selectedRider.assignedOrderIds.map(orderId => {
                        const order = orders.find(o => o.id === orderId);
                        if (!order) return null;
                        return (
                          <div key={orderId} className="flex justify-between items-center bg-[#162035] border border-[#1E2D45] p-2.5 rounded-lg text-sm">
                            <div className="font-mono text-[#22C55E] text-xs">{orderId}</div>
                            <div className="text-[#F1F5F9] text-xs">{order.customerNodeId}</div>
                            <div className="font-mono text-[#64748B] text-xs">{order.totalWeight.toFixed(1)}kg</div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-sm text-[#64748B] italic px-1">None</div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
