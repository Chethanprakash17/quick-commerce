import { CityEdge, AlgoStep } from "@/lib/types";

export function bfs(graph: Map<string, CityEdge[]>, startNodeId: string, targetNodeId?: string): { visited: string[]; steps: AlgoStep[] } {
  const visited = new Set<string>();
  const queue = [startNodeId];
  const steps: AlgoStep[] = [];
  visited.add(startNodeId);
  let stepNumber = 1;

  while (queue.length > 0) {
    const node = queue.shift()!;
    const edges = graph.get(node) || [];
    const enqueued = [];
    const highlightEdges = [];

    for (const edge of edges) {
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push(edge.to);
        enqueued.push(edge.to);
        highlightEdges.push(edge.id);
      }
    }

    steps.push({
      stepNumber: stepNumber++,
      description: `Dequeued ${node}. Enqueued ${enqueued.join(", ")}`,
      highlightNodes: [node],
      highlightEdges
    });

    if (targetNodeId && node === targetNodeId) break;
  }

  return { visited: Array.from(visited), steps };
}
