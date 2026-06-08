import React, { useState, useEffect } from 'react';
import { useAlgoStore } from '@/lib/store/useAlgoStore';
import { CITY_NODES, CITY_EDGES, buildAdjacencyList } from '@/lib/simulation/cityGraph';
import { bfs } from '@/lib/algorithms/bfs';
import { dfs } from '@/lib/algorithms/dfs';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import CityMap from '@/components/map/CityMap';
import { motion } from 'framer-motion';

interface Props {
  type: 'BFS' | 'DFS';
}

export default function BFSDFSVisualizer({ type }: Props) {
  const { startNodeId, setNodes, runAlgorithm, steps, currentStep, stepForward, stepBackward, resetVisualization } = useAlgoStore();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        stepForward();
      }, 800);
    } else if (isPlaying && currentStep >= steps.length - 1) {
      setTimeout(() => setIsPlaying(false), 0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, stepForward]);

  const handleRun = () => {
    if (!startNodeId) return;
    resetVisualization();
    const graph = buildAdjacencyList(CITY_EDGES);
    if (type === 'BFS') {
      runAlgorithm(() => bfs(graph, startNodeId));
    } else {
      runAlgorithm(() => dfs(graph, startNodeId));
    }
  };

  const currentStepData = steps[currentStep];
  const highlightedNodes = currentStepData?.highlightNodes || [];
  const highlightedEdges = currentStepData?.highlightEdges || [];

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="bg-[#0E1628] border border-[#1E2D45] rounded-xl p-4 flex items-center justify-between shrink-0">
        <div className="flex gap-4 items-center">
          <Select value={startNodeId || ''} onValueChange={(v) => setNodes(v || '')}>
            <SelectTrigger className="w-[180px] bg-[#162035] border-[#1E2D45] text-white">
              <SelectValue placeholder="Start Node" />
            </SelectTrigger>
            <SelectContent className="bg-[#162035] border-[#1E2D45] text-white max-h-40">
              {CITY_NODES.map(n => <SelectItem key={n.id} value={n.id}>{n.id}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={handleRun} disabled={!startNodeId} className="bg-[#22C55E] text-[#070C18] hover:bg-[#22C55E]/90 h-10">
            Run {type}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748B] font-mono mr-2">Step {steps.length > 0 ? currentStep + 1 : 0}/{steps.length}</span>
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
            className={`${isPlaying ? 'bg-[#22C55E] text-[#070C18] border-[#22C55E]' : 'bg-[#162035] border-[#1E2D45] text-[#22C55E]'} h-8 w-8`}
          >
            <Play size={14} />
          </Button>
          <Button variant="outline" size="icon" onClick={stepForward} disabled={currentStep >= steps.length - 1 || steps.length === 0} className="bg-[#162035] border-[#1E2D45] text-white h-8 w-8">
            <SkipForward size={14} />
          </Button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        <div className="w-[70%] bg-[#0E1628] border border-[#1E2D45] rounded-xl overflow-hidden relative">
           <CityMap
             highlightedRoute={highlightedNodes}
             highlightedEdges={highlightedEdges}
           />
        </div>

        <div className="w-[30%] bg-[#0E1628] border border-[#1E2D45] rounded-xl p-4 flex flex-col">
          <h3 className="font-heading font-semibold text-[#F1F5F9] mb-4 text-sm">{type} Traversal Log</h3>
          <div className="flex-1 overflow-y-auto space-y-2">
            {steps.slice(0, currentStep + 1).map(step => (
              <motion.div
                key={step.stepNumber}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-2 rounded border text-xs ${step.stepNumber === currentStep + 1 ? 'bg-[#22C55E]/10 border-[#22C55E] text-[#22C55E]' : 'bg-[#162035] border-[#1E2D45] text-[#64748B]'}`}
              >
                <div className="font-mono mb-1 font-semibold">{(step.highlightNodes && step.highlightNodes.length > 0) ? step.highlightNodes[0] : ''}</div>
                <div>{step.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
