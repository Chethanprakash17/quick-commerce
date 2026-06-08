export const ALGORITHM_COMPLEXITY = {
  dijkstra: { name: "Dijkstra's Shortest Path", time: "O((V + E) log V)", space: "O(V)", category: "Greedy + Graph", usedFor: ["Store selection", "Route calculation"], whyChosen: "Guarantees optimal shortest path", alternative: "Bellman-Ford" },
  knapsack: { name: "0/1 Knapsack", time: "O(n × W)", space: "O(n × W)", category: "Dynamic Programming", usedFor: ["Vehicle capacity"], whyChosen: "Guarantees optimal selection", alternative: "Greedy fractional" },
  greedy: { name: "Greedy Scheduling", time: "O(n log n)", space: "O(n)", category: "Greedy", usedFor: ["Order prioritization"], whyChosen: "Fast", alternative: "EDF" },
  bfs: { name: "BFS", time: "O(V + E)", space: "O(V)", category: "Graph Traversal", usedFor: ["Connectivity"], whyChosen: "Shortest hop", alternative: "DFS" },
  dfs: { name: "DFS", time: "O(V + E)", space: "O(V)", category: "Graph Traversal", usedFor: ["Route exploration"], whyChosen: "Memory efficient", alternative: "BFS" },
  tsp: { name: "Nearest-Neighbor TSP", time: "O(n^2)", space: "O(n)", category: "Approximation", usedFor: ["Multi-stop"], whyChosen: "Fast", alternative: "Exact DP" },
  pooling: { name: "Greedy Pooling", time: "O(n^2)", space: "O(n)", category: "Greedy + Graph", usedFor: ["Combining orders"], whyChosen: "Reduces trips", alternative: "K-means" }
};
