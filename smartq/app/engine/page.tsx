"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrderStore } from '@/lib/store/useOrderStore';
import { useStoreStore } from '@/lib/store/useStoreStore';
import { useRiderStore } from '@/lib/store/useRiderStore';
import { CITY_NODES, buildAdjacencyList, CITY_EDGES } from '@/lib/simulation/cityGraph';
import { selectBestStore, selectBestRider } from '@/lib/algorithms/greedy';
import { dijkstra } from '@/lib/algorithms/dijkstra';
import { poolOrders } from '@/lib/algorithms/pooling';
import { knapsack } from '@/lib/algorithms/knapsack';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, Box, Route, ArrowRightLeft, Bike } from 'lucide-react';
import { toast } from 'sonner';

export default function EnginePage() {
  const [knapsackRiderId, setKnapsackRiderId] = useState<string>('');
  const [knapsackSelectedOrders, setKnapsackSelectedOrders] = useState<Set<string>>(new Set());
  const [knapsackResult, setKnapsackResult] = useState<{selectedOrderIds: string[], totalWeight: number, utilizationPercent: number} | null>(null);

  const [routeSource, setRouteSource] = useState<string>('');
  const [routeDest, setRouteDest] = useState<string>('');
  const [routeResult, setRouteResult] = useState<{distance: number, travelTime: number, path: string[]} | null>(null);

  interface PoolResult {
    pools: { id: string, orderIds: string[], route: string[], totalDistance: number }[];
    distanceSaved: number;
    timeSaved: number;
    efficiencyGain: number;
  }
  const [poolingResult, setPoolingResult] = useState<PoolResult | null>(null);

  const [optimizationStep, setOptimizationStep] = useState<number>(0);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const [logs, setLogs] = useState<{ id: string; time: number; type: string; msg: string; color: string }[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const orders = useOrderStore(state => state.orders);
  const riders = useRiderStore(state => state.riders);
  const stores = useStoreStore(state => state.stores);
  const pendingOrders = orders.filter(o => o.status === 'pending');

  const addLog = (type: string, msg: string, color: string) => {
    setLogs(prev => [...prev, { id: `log-${Date.now()}-${prev.length}`, time: Date.now(), type, msg, color }]);
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleRunKnapsack = () => {
    const rider = riders.find(r => r.id === knapsackRiderId);
    if (!rider) return toast.error("Select a rider first");

    const ordersToPack = pendingOrders.filter(o => knapsackSelectedOrders.has(o.id));
    if (ordersToPack.length === 0) return toast.error("Select at least one pending order");

    const start = performance.now();
    const result = knapsack(ordersToPack, rider.capacity);
    const end = performance.now();

    setKnapsackResult(result);
    addLog('Knapsack', `Optimized load for ${rider.name} (${rider.capacity}kg). Selected ${result.selectedOrderIds.length} orders in ${(end - start).toFixed(2)}ms`, '#A855F7');
  };

  const handleRunRoute = () => {
    if (!routeSource || !routeDest) return toast.error("Select source and destination");

    const graph = buildAdjacencyList(CITY_EDGES);
    const start = performance.now();
    const result = dijkstra(graph, routeSource, routeDest);
    const end = performance.now();

    setRouteResult(result);
    addLog('Dijkstra', `Path found from ${routeSource} to ${routeDest}: ${result.distance}km in ${(end - start).toFixed(2)}ms`, '#3B82F6');
  };

  const handleRunPooling = () => {
    const graph = buildAdjacencyList(CITY_EDGES);
    const start = performance.now();
    const result = poolOrders(pendingOrders, riders, graph);
    const end = performance.now();

    setPoolingResult(result);
    addLog('Pooling', `Found ${result.pools.length} pooling opportunities saving ${result.distanceSaved}km in ${(end - start).toFixed(2)}ms`, '#FACC15');
  };

  const runFullOptimization = async () => {
    if (pendingOrders.length === 0) return toast.error("No pending orders to optimize");
    setIsOptimizing(true);
    setOptimizationStep(1);

    const graph = buildAdjacencyList(CITY_EDGES);
    const orderToOptimize = pendingOrders[0];

    // Step 1: Store Selection
    await new Promise(r => setTimeout(r, 600));
    const store = selectBestStore(orderToOptimize, stores, graph, CITY_NODES);
    addLog('Greedy', `Selected best store for ${orderToOptimize.id}`, '#22C55E');
    setOptimizationStep(2);

    if (!store) {
      toast.error("Optimization failed: No available stores");
      setIsOptimizing(false);
      setOptimizationStep(0);
      return;
    }

    // Step 2: Rider Selection
    await new Promise(r => setTimeout(r, 600));
    const rider = selectBestRider(orderToOptimize, store, riders, graph);
    if (!rider) {
      addLog('Greedy', `No rider available for ${store.name}`, '#EF4444');
    } else {
      addLog('Greedy', `Selected rider for ${store.name}`, '#22C55E');
    }
    setOptimizationStep(3);

    // Step 3: Route Calculation
    await new Promise(r => setTimeout(r, 600));
    const route = dijkstra(graph, store.nodeId, orderToOptimize.customerNodeId);
    addLog('Dijkstra', `Calculated route distance: ${route.distance}km`, '#3B82F6');
    setOptimizationStep(4);

    // Step 4: Pooling Check
    await new Promise(r => setTimeout(r, 600));
    const poolRes = poolOrders([orderToOptimize, ...pendingOrders.slice(1)], riders, graph);
    if (poolRes.pools.length > 0) {
      addLog('Pooling', `Checked pooling: matched with ${poolRes.pools[0].orderIds.length - 1} other orders`, '#FACC15');
    } else {
      addLog('Pooling', `Checked pooling: no efficient matches found`, '#FACC15');
    }
    setOptimizationStep(5);

    // Finalize
    await new Promise(r => setTimeout(r, 600));
    addLog('System', `Optimization complete for ${orderToOptimize.id}`, '#F1F5F9');

    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationStep(0);
      toast.success("Optimization run completed successfully.");
    }, 1000);
  };

  const algoStatusList = [
    { name: 'Greedy Priority Scheduling', status: isOptimizing ? 'Running' : 'Idle', time: '12ms', result: 'Priorities updated' },
    { name: 'Dijkstra Shortest Path', status: optimizationStep === 3 ? 'Running' : 'Idle', time: '4ms', result: routeResult ? 'Path calculated' : 'Waiting' },
    { name: 'Knapsack DP Optimizer', status: 'Idle', time: '8ms', result: knapsackResult ? 'Capacity optimized' : 'Waiting' },
    { name: 'BFS Radius Search', status: 'Idle', time: '1ms', result: 'Proximity checked' },
    { name: 'DFS Route Exploration', status: 'Idle', time: '2ms', result: 'Waiting' },
    { name: 'TSP Sequence Heuristic', status: 'Idle', time: '5ms', result: poolingResult ? 'Stops ordered' : 'Waiting' },
    { name: 'Order Pooling Engine', status: optimizationStep === 4 ? 'Running' : 'Idle', time: '15ms', result: poolingResult ? 'Matches found' : 'Waiting' },
  ];

  return (
    <motion.div
      className="p-6 h-full flex flex-col overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-[#F1F5F9]">Optimization Engine</h1>
        <p className="text-[#64748B] text-sm mt-1">Multi-constraint delivery optimization powered by DAA algorithms.</p>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column: Algo Status */}
        <div className="col-span-3 bg-[#0E1628] border border-[#1E2D45] rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#1E2D45] bg-[#162035]/30">
            <h2 className="font-heading font-semibold text-[#F1F5F9]">Algorithm Status</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {algoStatusList.map((algo, i) => (
              <div key={i} className="p-3 border-b border-[#1E2D45] last:border-0">
                <div className="text-sm font-medium text-[#F1F5F9] mb-2">{algo.name}</div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={`text-[10px] rounded-full uppercase border-0 px-2 py-0 ${
                    algo.status === 'Running' ? 'bg-[#FACC15]/20 text-[#FACC15] animate-pulse' :
                    algo.status === 'Completed' ? 'bg-[#22C55E]/20 text-[#22C55E]' :
                    'bg-[#64748B]/20 text-[#64748B]'
                  }`}>
                    {algo.status}
                  </Badge>
                  <div className="text-[10px] text-[#64748B] font-mono">{algo.time}</div>
                </div>
                <div className="text-xs text-[#64748B] mt-2 italic">{algo.result}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column: Control Panel */}
        <div className="col-span-6 flex flex-col gap-6 overflow-y-auto pr-2">
          {/* Section 1: Full Opt */}
          <div className="bg-[#0E1628] border border-[#1E2D45] rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-semibold text-[#F1F5F9] flex items-center gap-2">
                <Zap size={18} className="text-[#22C55E]" /> Live Pipeline Optimization
              </h3>
              <Button
                onClick={runFullOptimization}
                disabled={isOptimizing || pendingOrders.length === 0}
                className="bg-[#22C55E] text-[#070C18] hover:bg-[#22C55E]/90 h-8 text-xs font-medium"
              >
                {isOptimizing ? 'Optimizing...' : 'Run Full Pipeline'}
              </Button>
            </div>

            <div className="grid grid-cols-5 gap-2 mt-6">
              {[
                { step: 1, label: 'Store Select', icon: Box },
                { step: 2, label: 'Rider Match', icon: Bike },
                { step: 3, label: 'Path Find', icon: Route },
                { step: 4, label: 'Pooling', icon: ArrowRightLeft },
                { step: 5, label: 'Finalize', icon: CheckCircle }
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-2 relative">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 bg-[#0E1628]
                      ${optimizationStep > s.step ? 'border-[#22C55E] text-[#22C55E]' :
                        optimizationStep === s.step ? 'border-[#FACC15] text-[#FACC15] shadow-[0_0_15px_rgba(250,204,21,0.3)]' :
                        'border-[#1E2D45] text-[#64748B]'}`}
                  >
                    <s.icon size={16} />
                  </motion.div>
                  <div className={`text-[10px] uppercase font-mono text-center
                    ${optimizationStep >= s.step ? 'text-[#F1F5F9]' : 'text-[#64748B]'}`}
                  >
                    {s.label}
                  </div>
                  {i < 4 && (
                    <div className="absolute top-5 left-[50%] w-full h-[2px] bg-[#1E2D45] -z-0">
                      <motion.div
                        className="h-full bg-[#22C55E]"
                        initial={{ width: '0%' }}
                        animate={{ width: optimizationStep > s.step ? '100%' : '0%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Knapsack */}
          <div className="bg-[#0E1628] border border-[#1E2D45] rounded-xl p-5">
            <h3 className="font-heading font-semibold text-[#F1F5F9] mb-4">Knapsack Load Optimizer (DP)</h3>
            <div className="flex gap-4 mb-4">
              <div className="flex-1 space-y-2">
                <Select value={knapsackRiderId} onValueChange={(val) => setKnapsackRiderId(val || '')}>
                  <SelectTrigger className="bg-[#162035] border-[#1E2D45] text-white">
                    <SelectValue placeholder="Select Rider" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#162035] border-[#1E2D45] text-white">
                    {riders.filter(r => r.status === 'available').map(r => (
                      <SelectItem key={r.id} value={r.id}>{r.name} (Cap: {r.capacity}kg)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleRunKnapsack} className="bg-[#A855F7] text-white hover:bg-[#A855F7]/90 mt-auto">Run DP</Button>
            </div>

            <div className="max-h-32 overflow-y-auto mb-4 bg-[#162035] p-2 rounded-lg border border-[#1E2D45]">
              {pendingOrders.map(o => (
                <label key={o.id} className="flex items-center gap-3 p-2 hover:bg-[#0E1628] rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={knapsackSelectedOrders.has(o.id)}
                    onChange={(e) => {
                      const newSet = new Set(knapsackSelectedOrders);
                      if (e.target.checked) newSet.add(o.id);
                      else newSet.delete(o.id);
                      setKnapsackSelectedOrders(newSet);
                    }}
                    className="rounded border-[#1E2D45] text-[#A855F7] focus:ring-[#A855F7] bg-[#0E1628]"
                  />
                  <div className="text-xs text-[#F1F5F9] flex-1">{o.id} <span className="text-[#64748B]">({o.priority})</span></div>
                  <div className="text-xs font-mono text-[#A855F7]">{o.totalWeight.toFixed(1)}kg</div>
                </label>
              ))}
              {pendingOrders.length === 0 && <div className="text-sm text-[#64748B] p-2">No pending orders.</div>}
            </div>

            {knapsackResult && (
              <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-lg p-3">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-[#22C55E] font-medium">Selected: {knapsackResult.selectedOrderIds.join(', ')}</span>
                  <span className="text-[#F1F5F9] font-mono">{knapsackResult.totalWeight.toFixed(1)}kg</span>
                </div>
                <div className="h-1.5 w-full bg-[#0E1628] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#22C55E]"
                    style={{ width: `${knapsackResult.utilizationPercent}%` }}
                  />
                </div>
                <div className="text-right text-[10px] text-[#64748B] mt-1 font-mono">{Math.round(knapsackResult.utilizationPercent)}% Utilized</div>
              </div>
            )}
          </div>

          {/* Section 3 & 4 Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Route Optimizer */}
            <div className="bg-[#0E1628] border border-[#1E2D45] rounded-xl p-5">
              <h3 className="font-heading font-semibold text-[#F1F5F9] mb-4 text-sm">Route Optimizer (Dijkstra)</h3>
              <div className="space-y-3 mb-4">
                <Select value={routeSource} onValueChange={(val) => setRouteSource(val || '')}>
                  <SelectTrigger className="bg-[#162035] border-[#1E2D45] text-white h-8 text-xs">
                    <SelectValue placeholder="Source Node" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#162035] border-[#1E2D45] text-white max-h-40">
                    {CITY_NODES.map(n => <SelectItem key={`s-${n.id}`} value={n.id} className="text-xs">{n.id}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={routeDest} onValueChange={(val) => setRouteDest(val || '')}>
                  <SelectTrigger className="bg-[#162035] border-[#1E2D45] text-white h-8 text-xs">
                    <SelectValue placeholder="Destination Node" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#162035] border-[#1E2D45] text-white max-h-40">
                    {CITY_NODES.map(n => <SelectItem key={`d-${n.id}`} value={n.id} className="text-xs">{n.id}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleRunRoute} className="w-full bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90 h-8 text-xs mb-3">Calculate Shortest Path</Button>

              {routeResult && (
                <div className="bg-[#162035] border border-[#1E2D45] rounded p-2">
                  <div className="text-[10px] text-[#64748B] mb-1">Result:</div>
                  <div className="text-xs text-[#F1F5F9] font-mono mb-1 truncate">{routeResult.path.join(' → ')}</div>
                  <div className="flex justify-between text-xs text-[#3B82F6] font-mono font-medium">
                    <span>{routeResult.distance}km</span>
                    <span>{routeResult.travelTime}m</span>
                  </div>
                </div>
              )}
            </div>

            {/* Pooling Engine */}
            <div className="bg-[#0E1628] border border-[#1E2D45] rounded-xl p-5">
              <h3 className="font-heading font-semibold text-[#F1F5F9] mb-4 text-sm">Pooling Engine (Greedy+TSP)</h3>
              <p className="text-[10px] text-[#64748B] mb-4">Scans pending orders within 2-hop radius for batching opportunities to optimize rider trips.</p>
              <Button onClick={handleRunPooling} className="w-full bg-[#FACC15] text-[#070C18] hover:bg-[#FACC15]/90 h-8 text-xs mb-3 font-medium">Check Opportunities</Button>

              {poolingResult && (
                <div className="bg-[#162035] border border-[#1E2D45] rounded p-2">
                  <div className="text-xs text-[#F1F5F9] mb-2">{poolingResult.pools.length} Pools Identified</div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-[#0E1628] rounded p-1">
                      <div className="text-[9px] text-[#64748B] uppercase">Dist Saved</div>
                      <div className="text-xs text-[#22C55E] font-mono font-medium">{poolingResult.distanceSaved}km</div>
                    </div>
                    <div className="bg-[#0E1628] rounded p-1">
                      <div className="text-[9px] text-[#64748B] uppercase">Efficiency</div>
                      <div className="text-xs text-[#FACC15] font-mono font-medium">+{poolingResult.efficiencyGain}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Algo Log */}
        <div className="col-span-3 bg-[#0E1628] border border-[#1E2D45] rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#1E2D45] bg-[#162035]/30">
            <h2 className="font-heading font-semibold text-[#F1F5F9]">Execution Log</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[11px]">
            <AnimatePresence initial={false}>
              {logs.map(log => {
                const timeStr = new Date(log.time).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + log.time.toString().slice(-3);
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="leading-relaxed"
                  >
                    <span className="text-[#64748B] mr-2">[{timeStr}]</span>
                    <span style={{ color: log.color }} className="font-bold mr-1">[{log.type}]</span>
                    <span className="text-[#F1F5F9]">{log.msg}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {logs.length === 0 && (
              <div className="text-[#64748B] text-center mt-4">Waiting for execution...</div>
            )}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
