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
  let w_rem = W;
  let totalWeight = 0;

  for (let i = n; i > 0 && res > 0; i--) {
    if (res !== dp[i - 1][w_rem]) {
      selectedOrderIds.push(orders[i - 1].id);
      totalWeight += orders[i - 1].totalWeight;
      res -= orders[i - 1].priorityScore;
      w_rem -= Math.floor(orders[i - 1].totalWeight * 10);
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
  const W = Math.floor(capacityKg * 10);
  const n = orders.length;
  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(W + 1).fill(0));
  const steps: KnapsackStep[] = [];

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

    const dpCopy = dp.map(row => [...row]);

    steps.push({
      stepNumber: i,
      item: orders[i - 1].id,
      weight: orders[i - 1].totalWeight,
      included: dp[i][W] !== dp[i - 1][W],
      remainingCapacity: capacityKg - orders[i - 1].totalWeight,
      dpTable: dpCopy,
      description: `Evaluated ${orders[i-1].id}`
    });
  }

  const selectedOrderIds: string[] = [];
  let res = dp[n][W];
  let w_rem = W;
  let totalWeight = 0;

  for (let i = n; i > 0 && res > 0; i--) {
    if (res !== dp[i - 1][w_rem]) {
      selectedOrderIds.push(orders[i - 1].id);
      totalWeight += orders[i - 1].totalWeight;
      res -= orders[i - 1].priorityScore;
      w_rem -= Math.floor(orders[i - 1].totalWeight * 10);
    }
  }

  return {
    selectedOrderIds,
    totalWeight,
    totalValue: dp[n][W],
    utilizationPercent: (totalWeight / capacityKg) * 100,
    steps
  };
}
