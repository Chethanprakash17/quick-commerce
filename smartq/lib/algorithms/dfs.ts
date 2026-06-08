import { CityEdge, AlgoStep } from "@/lib/types";

export function dfs(graph: Map<string, CityEdge[]>, startNodeId: string): { visited: string[]; steps: AlgoStep[] } {
  const visited = new Set<string>();
  const stack = [startNodeId];
  const steps: AlgoStep[] = [];
  let stepNumber = 1;

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (!visited.has(node)) {
      visited.add(node);
      const edges = graph.get(node) || [];
      const highlightEdges = [];

      for (const edge of edges) {
        if (!visited.has(edge.to)) {
          stack.push(edge.to);
          highlightEdges.push(edge.id);
        }
      }

      steps.push({
        stepNumber: stepNumber++,
        description: `Popped ${node}`,
        highlightNodes: [node],
        highlightEdges
      });
    }
  }

  return { visited: Array.from(visited), steps };
}
