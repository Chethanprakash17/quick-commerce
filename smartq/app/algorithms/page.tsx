"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlgoStore } from '@/lib/store/useAlgoStore';
import { ALGORITHM_COMPLEXITY } from '@/lib/algorithms/complexity';
import { Badge } from "@/components/ui/badge";
import DijkstraVisualizer from '@/components/algorithms/DijkstraVisualizer';
import KnapsackVisualizer from '@/components/algorithms/KnapsackVisualizer';
import BFSDFSVisualizer from '@/components/algorithms/BFSDFSVisualizer';
import SchedulingVisualizer from '@/components/algorithms/SchedulingVisualizer';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function AlgorithmsPage() {
  const selectedAlgorithm = useAlgoStore(state => state.selectedAlgorithm);
  const setAlgorithm = useAlgoStore(state => state.setAlgorithm);

  const [expandedNotes, setExpandedNotes] = useState(false);

  const renderVisualizer = () => {
    switch (selectedAlgorithm) {
      case 'dijkstra': return <DijkstraVisualizer />;
      case 'knapsack': return <KnapsackVisualizer />;
      case 'bfs': return <BFSDFSVisualizer type="BFS" />;
      case 'dfs': return <BFSDFSVisualizer type="DFS" />;
      case 'greedy': return <SchedulingVisualizer />;
      default: return (
        <div className="flex items-center justify-center h-full text-[#64748B]">
          Select an algorithm from the left sidebar to start visualization.
        </div>
      );
    }
  };

  const getAlgoDetails = () => {
    if (!selectedAlgorithm) return null;
    return ALGORITHM_COMPLEXITY[selectedAlgorithm as keyof typeof ALGORITHM_COMPLEXITY];
  };

  const getFacultyNotes = (algoId: string) => {
    switch (algoId) {
      case 'dijkstra':
        return (
          <>
            <div className="font-bold text-[#3B82F6] mb-1">Q: Why not use BFS?</div>
            <p className="text-[#F1F5F9] mb-3">BFS finds the shortest path by the number of hops. However, in our city graph, edges have variable weights (distance and traffic time). BFS cannot guarantee the shortest path in a weighted graph, whereas Dijkstra does.</p>
            <div className="font-bold text-[#3B82F6] mb-1">Q: Why not A*?</div>
            <p className="text-[#F1F5F9]">A* requires an admissible heuristic (like straight-line distance). While it can be faster, Dijkstra is simpler to implement, requires no heuristic tuning, and is extremely performant for graphs of this size.</p>
          </>
        );
      case 'knapsack':
        return (
          <>
            <div className="font-bold text-[#A855F7] mb-1">Q: Why Dynamic Programming instead of a Greedy approach?</div>
            <p className="text-[#F1F5F9] mb-3">A Greedy approach sorting by value/weight ratio guarantees an optimal solution only for the fractional knapsack problem. For 0/1 knapsack (where we cannot split orders), greedy can yield suboptimal results. DP guarantees a 100% optimal packing.</p>
            <div className="font-bold text-[#A855F7] mb-1">Q: Isn&apos;t O(nW) too slow?</div>
            <p className="text-[#F1F5F9]">This is a pseudo-polynomial time complexity. Given our strict constraints on rider capacity (e.g. 15-25kg) and order weights, W is small. Therefore, O(nW) runs very quickly in real-time scenarios.</p>
          </>
        );
      case 'tsp':
      case 'pooling':
        return (
          <>
            <div className="font-bold text-[#FACC15] mb-1">Q: Why not solve TSP exactly?</div>
            <p className="text-[#F1F5F9]">Exact TSP is NP-Hard with O(n!) complexity. The Nearest-Neighbor heuristic runs in O(n²) and generally produces routes within 25% of the optimal length, making it ideal for real-time dispatch systems.</p>
          </>
        );
      default:
        return null;
    }
  };

  const details = getAlgoDetails();

  return (
    <motion.div
      className="p-6 h-full flex flex-col overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 flex justify-between items-start shrink-0">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#F1F5F9] flex items-center gap-3">
            Algorithm Visualization Laboratory
            <Badge className="bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/30 hover:bg-[#A855F7]/30">DAA Core Module</Badge>
          </h1>
          <p className="text-[#64748B] text-sm mt-1">Step-by-step execution of core DAA algorithms.</p>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Sidebar */}
        <div className="w-[260px] bg-[#0E1628] border border-[#1E2D45] rounded-xl flex flex-col shrink-0">
          <div className="p-4 border-b border-[#1E2D45] bg-[#162035]/30">
            <h2 className="font-heading font-semibold text-[#F1F5F9]">Algorithms</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {[
              { id: 'dijkstra', label: 'Dijkstra', cat: 'Greedy+Graph', time: 'O((V+E)logV)' },
              { id: 'bfs', label: 'BFS', cat: 'Traversal', time: 'O(V+E)' },
              { id: 'dfs', label: 'DFS', cat: 'Traversal', time: 'O(V+E)' },
              { id: 'knapsack', label: 'Knapsack DP', cat: 'DP', time: 'O(n*W)' },
              { id: 'greedy', label: 'Greedy Schedule', cat: 'Greedy', time: 'O(n log n)' },
              { id: 'tsp', label: 'TSP Heuristic', cat: 'Approximation', time: 'O(n^2)' },
              { id: 'pooling', label: 'Order Pooling', cat: 'Greedy+Graph', time: 'O(n^2)' },
            ].map(algo => {
              const isActive = selectedAlgorithm === algo.id;
              return (
                <button
                  key={algo.id}
                  onClick={() => { setAlgorithm(algo.id); setExpandedNotes(false); }}
                  className={`w-full text-left p-3 rounded-lg border-l-2 transition-colors ${
                    isActive
                      ? 'bg-[#22C55E]/10 border-[#22C55E]'
                      : 'border-transparent hover:bg-[#162035]'
                  }`}
                >
                  <div className={`font-medium mb-1 ${isActive ? 'text-[#22C55E]' : 'text-[#F1F5F9]'}`}>{algo.label}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#64748B] uppercase">{algo.cat}</span>
                    <span className="text-[10px] text-[#FACC15] font-mono">{algo.time}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 min-h-0 mb-4">
            {renderVisualizer()}
          </div>

          {/* Info Panel */}
          {details && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={selectedAlgorithm}
              className="bg-[#0E1628] border border-[#1E2D45] rounded-xl p-4 shrink-0 flex flex-col"
            >
              <div className="flex gap-6">
                <div className="w-1/3 border-r border-[#1E2D45] pr-6">
                  <h3 className="font-heading font-semibold text-[#F1F5F9] mb-3">{details.name}</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Time</span>
                      <span className="text-[#FACC15] font-mono">{details.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Space</span>
                      <span className="text-[#3B82F6] font-mono">{details.space}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Category</span>
                      <span className="text-[#A855F7]">{details.category}</span>
                    </div>
                  </div>
                </div>

                <div className="w-2/3 flex flex-col gap-2 pl-2 overflow-y-auto max-h-[140px]">
                  <div>
                    <h4 className="text-[10px] text-[#64748B] uppercase font-semibold mb-1">Why Chosen</h4>
                    <p className="text-xs text-[#F1F5F9] leading-relaxed mb-2">{details.whyChosen}</p>

                    <h4 className="text-[10px] text-[#64748B] uppercase font-semibold mb-1">Alternative Approach</h4>
                    <p className="text-xs text-[#F1F5F9] leading-relaxed">{details.alternative}</p>
                  </div>

                  {['dijkstra', 'knapsack', 'tsp', 'pooling'].includes(selectedAlgorithm || '') && (
                    <div className="mt-2 pt-2 border-t border-[#1E2D45]">
                      <button
                        onClick={() => setExpandedNotes(!expandedNotes)}
                        className="flex items-center gap-2 text-xs font-semibold text-[#F1F5F9] hover:text-[#22C55E] transition-colors uppercase"
                      >
                        {expandedNotes ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        Faculty Notes
                      </button>
                      <AnimatePresence>
                        {expandedNotes && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-2 text-xs overflow-hidden"
                          >
                            {getFacultyNotes(selectedAlgorithm!)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
