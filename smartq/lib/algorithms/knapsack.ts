import { Order, KnapsackResult, KnapsackStep } from "@/lib/types";

export function knapsack(orders: Order[], capacityKg: number): KnapsackResult {
  const W = Math.floor(capacityKg * 10);
  const n = orders.length;
  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const w = Math.floor(orders[i - 1].totalWeight * 10);
    const v = orders[i - 1].priorityScore;
    for (let j = 0; j <= W; j++) {
      if (w <= j) {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - w] + v);
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }

  const selectedOrderIds: string[] = [];
  let res = dp[n][W];
  let w = W;
  let totalWeight = 0;

  for (let i = n; i > 0 && res > 0; i--) {
    if (res !== dp[i - 1][w]) {
      selectedOrderIds.push(orders[i - 1].id);
      totalWeight += orders[i - 1].totalWeight;
      res -= orders[i - 1].priorityScore;
      w -= Math.floor(orders[i - 1].totalWeight * 10);
    }
  }

  return {
    selectedOrderIds,
    totalWeight,
    totalValue: dp[n][W],
    utilizationPercent: (totalWeight / capacityKg) * 100,
    steps: []
  };
}

export function knapsackWithSteps(orders: Order[], capacityKg: number): KnapsackResult {
  const result = knapsack(orders, capacityKg);
  result.steps = [{ stepNumber: 1, item: "All", weight: 0, included: true, remainingCapacity: 0, description: "Computed knapsack" }];
  return result;
}
