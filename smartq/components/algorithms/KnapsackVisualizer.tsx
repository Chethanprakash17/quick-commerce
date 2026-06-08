import React, { useState } from 'react';
import { useAlgoStore } from '@/lib/store/useAlgoStore';
import { knapsackWithSteps } from '@/lib/algorithms/knapsack';
import { useOrderStore } from '@/lib/store/useOrderStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCcw } from 'lucide-react';
import { KnapsackStep } from '@/lib/types';

export default function KnapsackVisualizer() {
  const { runAlgorithm, steps, currentStep, stepForward, stepBackward, resetVisualization } = useAlgoStore();
  const orders = useOrderStore(state => state.getPendingOrders()).slice(0, 10); // Limit to 10 for viz
  const [capacity, setCapacity] = useState(15);

  const handleRun = () => {
    resetVisualization();
    runAlgorithm(() => knapsackWithSteps(orders, capacity));
  };

  const currentStepData = steps[currentStep] as KnapsackStep | undefined;
  const dpTable = currentStepData?.dpTable;

  const displayCols = Math.min(20, capacity);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="bg-[#0E1628] border border-[#1E2D45] rounded-xl p-4 flex items-center justify-between shrink-0">
        <div className="flex gap-4 items-center">
          <label className="text-xs text-[#F1F5F9]">Capacity (kg):</label>
          <Input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="w-20 h-8 bg-[#162035] border-[#1E2D45] text-white text-xs"
          />
          <Button onClick={handleRun} disabled={orders.length === 0} className="bg-[#A855F7] text-white hover:bg-[#A855F7]/90 h-8 text-xs">
            Generate DP Table
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748B] font-mono mr-2">Step {steps.length > 0 ? currentStep + 1 : 0}/{steps.length}</span>
          <Button variant="outline" size="icon" onClick={resetVisualization} disabled={steps.length === 0} className="bg-[#162035] border-[#1E2D45] text-white h-8 w-8">
            <RotateCcw size={14} />
          </Button>
          <Button variant="outline" size="sm" onClick={stepBackward} disabled={currentStep === 0 || steps.length === 0} className="bg-[#162035] border-[#1E2D45] text-white h-8 text-xs">
            Back
          </Button>
          <Button variant="outline" size="sm" onClick={stepForward} disabled={currentStep >= steps.length - 1 || steps.length === 0} className="bg-[#162035] border-[#1E2D45] text-white h-8 text-xs">
            Next
          </Button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        <div className="w-[30%] bg-[#0E1628] border border-[#1E2D45] rounded-xl p-4 overflow-y-auto">
          <h3 className="font-heading font-semibold text-[#F1F5F9] mb-4 text-sm">Available Items (Orders)</h3>
          <div className="space-y-2">
            {orders.map((o) => {
              const isCurrentItem = currentStepData?.item === o.id;
              const isIncluded = currentStepData?.item === o.id && currentStepData?.included;

              return (
                <div key={o.id} className={`p-2 rounded border ${isCurrentItem ? 'bg-[#A855F7]/20 border-[#A855F7]' : 'bg-[#162035] border-[#1E2D45]'} flex justify-between items-center transition-colors`}>
                  <div>
                    <div className="text-xs text-[#F1F5F9] font-mono">{o.id}</div>
                    <div className="text-[10px] text-[#64748B]">Val: <span className="text-[#FACC15]">{o.priorityScore}</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#3B82F6] font-mono">{o.totalWeight.toFixed(1)}kg</div>
                    {isIncluded && <div className="text-[10px] text-[#22C55E]">Selected</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-[70%] bg-[#0E1628] border border-[#1E2D45] rounded-xl p-4 flex flex-col relative overflow-hidden">
          <h3 className="font-heading font-semibold text-[#F1F5F9] mb-4 text-sm">Dynamic Programming Table (w={capacity})</h3>

          {dpTable ? (
            <div className="flex-1 overflow-auto border border-[#1E2D45] rounded">
              <table className="w-full text-[10px] text-center border-collapse">
                <thead className="bg-[#162035] sticky top-0 z-10">
                  <tr>
                    <th className="border border-[#1E2D45] p-1 text-[#64748B]">i \ w</th>
                    {Array.from({ length: displayCols + 1 }).map((_, w) => (
                      <th key={w} className="border border-[#1E2D45] p-1 text-[#64748B] font-mono">{w}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, dpTable.length - 1).map((o, i) => {
                    const rowIdx = i + 1;
                    const isComputingRow = !!currentStepData && currentStepData.stepNumber <= orders.length && currentStepData.item === o.id;

                    return (
                      <tr key={i}>
                        <td className="border border-[#1E2D45] p-1 font-mono text-[#F1F5F9] bg-[#162035] sticky left-0 z-10">{o.id}</td>
                        {Array.from({ length: displayCols + 1 }).map((_, w) => {
                          const colIdx = Math.floor((w / displayCols) * (capacity * 10));
                          const val = dpTable[rowIdx][colIdx] || 0;

                          const maxVal = Math.max(...dpTable[dpTable.length - 1]);
                          const intensity = maxVal > 0 ? val / maxVal : 0;
                          const r = Math.round(14 + (34 - 14) * intensity);
                          const g = Math.round(22 + (197 - 22) * intensity);
                          const b = Math.round(40 + (94 - 40) * intensity);
                          const bgColor = val > 0 ? `rgb(${r}, ${g}, ${b})` : 'transparent';

                          return (
                            <td
                              key={w}
                              className={`border border-[#1E2D45] p-1 font-mono transition-colors ${isComputingRow ? 'text-[#F1F5F9]' : 'text-[#64748B]'}`}
                              style={{ backgroundColor: bgColor }}
                            >
                              {val}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#64748B] text-sm">
              Click Generate DP Table to start
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
