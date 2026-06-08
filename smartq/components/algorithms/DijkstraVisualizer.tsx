import React, { useState, useEffect, useRef } from 'react';
import { useAlgoStore } from '@/lib/store/useAlgoStore';
import { CITY_NODES, CITY_EDGES, buildAdjacencyList } from '@/lib/simulation/cityGraph';
import { dijkstraWithSteps } from '@/lib/algorithms/dijkstra';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import CityMap from '@/components/map/CityMap';

export default function DijkstraVisualizer() {
  const { startNodeId, endNodeId, setNodes, runAlgorithm, steps, currentStep, stepForward, stepBackward, resetVisualization } = useAlgoStore();
  const [speed, setSpeed] = useState<number>(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        if (isPlayingRef.current) {
            stepForward();
        }
      }, speed);
    } else if (isPlaying && currentStep >= steps.length - 1) {
      setTimeout(() => setIsPlaying(false), 0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, speed, stepForward]);

  const handleRun = () => {
    if (!startNodeId || !endNodeId) return;
    resetVisualization();
    const graph = buildAdjacencyList(CITY_EDGES);
    runAlgorithm(() => dijkstraWithSteps(graph, startNodeId, endNodeId));
  };

  const currentStepData = steps[currentStep];
  const highlightedNodes = currentStepData?.highlightNodes || [];
  const highlightedEdges = currentStepData?.highlightEdges || [];
  const distances = (currentStepData?.data || {}) as Record<string, number>;

  const distanceTable = Object.entries(distances)
    .filter((entry) => entry[1] !== Infinity)
    .map(([node, dist]) => ({ node, dist }))
    .sort((a, b) => a.dist - b.dist);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Controls */}
      <div className="bg-[#0E1628] border border-[#1E2D45] rounded-xl p-4 flex items-center justify-between shrink-0">
        <div className="flex gap-4">
          <Select value={startNodeId || ''} onValueChange={(v) => setNodes(v || '', endNodeId || undefined)}>
            <SelectTrigger className="w-[180px] bg-[#162035] border-[#1E2D45] text-white">
              <SelectValue placeholder="Source Node" />
            </SelectTrigger>
            <SelectContent className="bg-[#162035] border-[#1E2D45] text-white max-h-40">
              {CITY_NODES.map(n => <SelectItem key={n.id} value={n.id}>{n.id}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={endNodeId || ''} onValueChange={(v) => setNodes(startNodeId || '', v || undefined)}>
            <SelectTrigger className="w-[180px] bg-[#162035] border-[#1E2D45] text-white">
              <SelectValue placeholder="Target Node" />
            </SelectTrigger>
            <SelectContent className="bg-[#162035] border-[#1E2D45] text-white max-h-40">
              {CITY_NODES.map(n => <SelectItem key={n.id} value={n.id}>{n.id}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={handleRun} disabled={!startNodeId || !endNodeId} className="bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90">
            Generate Steps
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Select value={speed.toString()} onValueChange={(v) => setSpeed(parseInt(v || '1000'))}>
            <SelectTrigger className="w-[100px] bg-[#162035] border-[#1E2D45] text-white text-xs h-8">
              <SelectValue placeholder="Speed" />
            </SelectTrigger>
            <SelectContent className="bg-[#162035] border-[#1E2D45] text-white text-xs">
              <SelectItem value="2000">Slow</SelectItem>
              <SelectItem value="1000">Normal</SelectItem>
              <SelectItem value="500">Fast</SelectItem>
              <SelectItem value="100">Very Fast</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={resetVisualization} disabled={steps.length === 0} className="bg-[#162035] border-[#1E2D45] text-white h-8 w-8">
            <RotateCcw size={14} />
          </Button>
          <Button variant="outline" size="icon" onClick={stepBackward} disabled={currentStep === 0 || steps.length === 0} className="bg-[#162035] border-[#1E2D45] text-white h-8 w-8">
            <SkipBack size={14} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={currentStep >= steps.length - 1 || steps.length === 0}
            className={`${isPlaying ? 'bg-[#3B82F6] text-white border-[#3B82F6]' : 'bg-[#162035] border-[#1E2D45] text-[#3B82F6]'} h-8 w-8`}
          >
            <Play size={14} />
          </Button>
          <Button variant="outline" size="icon" onClick={stepForward} disabled={currentStep >= steps.length - 1 || steps.length === 0} className="bg-[#162035] border-[#1E2D45] text-white h-8 w-8">
            <SkipForward size={14} />
          </Button>
        </div>
      </div>

      {/* Main View */}
      <div className="flex gap-4 flex-1 min-h-0">
        <div className="w-[60%] bg-[#0E1628] border border-[#1E2D45] rounded-xl overflow-hidden flex flex-col relative">
           <div className="absolute top-4 left-4 z-10 bg-[#0E1628]/80 backdrop-blur-sm border border-[#1E2D45] px-3 py-1.5 rounded-lg text-xs font-mono text-[#F1F5F9]">
             Step {steps.length > 0 ? currentStep + 1 : 0} / {steps.length}
           </div>
           <CityMap
             highlightedRoute={highlightedNodes}
             highlightedEdges={highlightedEdges}
             showDistances={true}
           />
        </div>

        <div className="w-[40%] flex flex-col gap-4">
          <div className="bg-[#0E1628] border border-[#1E2D45] rounded-xl flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-[#1E2D45] bg-[#162035]/30">
              <h3 className="font-heading font-semibold text-[#F1F5F9] text-sm">Distance Table</h3>
            </div>
            <div className="flex-1 overflow-auto p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#162035] sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-[#64748B] font-medium">Node</th>
                    <th className="px-4 py-2 text-[#64748B] font-medium text-right">Min Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {distanceTable.map(({ node, dist }) => {
                    const isCurrent = highlightedNodes.includes(node) && highlightedNodes.length === 1;
                    const isTarget = highlightedNodes.includes(node) && highlightedNodes.length > 1; // Simplification
                    return (
                      <tr key={node} className={`border-b border-[#1E2D45] ${isCurrent ? 'bg-[#3B82F6]/20' : isTarget ? 'bg-[#22C55E]/10' : 'hover:bg-[#162035]'}`}>
                        <td className="px-4 py-2 text-[#F1F5F9] font-mono">{node}</td>
                        <td className="px-4 py-2 text-right font-mono text-[#22C55E]">{dist.toFixed(1)}</td>
                      </tr>
                    );
                  })}
                  {distanceTable.length === 0 && (
                    <tr>
                      <td colSpan={2} className="text-center py-4 text-[#64748B]">No distances calculated yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="h-[120px] bg-[#0E1628] border border-[#1E2D45] rounded-xl flex flex-col overflow-hidden shrink-0">
             <div className="p-2 border-b border-[#1E2D45] bg-[#162035]/30 flex justify-between items-center">
               <h3 className="font-heading font-semibold text-[#F1F5F9] text-xs">Step Log</h3>
             </div>
             <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] text-[#F1F5F9] flex flex-col-reverse">
                <AnimatePresence initial={false}>
                  {steps.slice(0, currentStep + 1).reverse().map(step => (
                    <motion.div
                      key={step.stepNumber}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`py-1 ${step.stepNumber === currentStep + 1 ? 'text-[#3B82F6] font-semibold' : 'text-[#64748B]'}`}
                    >
                      <span className="mr-2 opacity-70">[{step.stepNumber}]</span>
                      {step.description}
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
