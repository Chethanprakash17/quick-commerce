import { CityEdge, DijkstraResult, AlgoStep } from "@/lib/types";

class MinHeap {
  private heap: [number, string][] = [];
  push(distance: number, nodeId: string): void {
    this.heap.push([distance, nodeId]);
    this.bubbleUp(this.heap.length - 1);
  }
  pop(): [number, string] | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();
    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);
    return min;
  }
  get size(): number { return this.heap.length; }
  private bubbleUp(index: number) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent][0] <= this.heap[index][0]) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }
  private bubbleDown(index: number) {
    const len = this.heap.length;
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let smallest = index;
      if (left < len && this.heap[left][0] < this.heap[smallest][0]) smallest = left;
      if (right < len && this.heap[right][0] < this.heap[smallest][0]) smallest = right;
      if (smallest === index) break;
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}

export function dijkstra(graph: Map<string, CityEdge[]>, startNodeId: string, endNodeId: string, useCurrentTrafficTime: boolean = true): DijkstraResult {
  const distances = new Map<string, number>();
  const previous = new Map<string, string>();
  const pq = new MinHeap();

  for (const node of graph.keys()) {
    distances.set(node, Infinity);
  }
  distances.set(startNodeId, 0);
  pq.push(0, startNodeId);

  while (pq.size > 0) {
    const popped = pq.pop();
    if (!popped) break;
    const [dist, node] = popped;

    if (node === endNodeId) break;
    if (dist > distances.get(node)!) continue;

    const edges = graph.get(node) || [];
    for (const edge of edges) {
      const weight = useCurrentTrafficTime ? edge.currentTravelTime : edge.baseTravelTime;
      const newDist = dist + weight;
      if (newDist < distances.get(edge.to)!) {
        distances.set(edge.to, newDist);
        previous.set(edge.to, node);
        pq.push(newDist, edge.to);
      }
    }
  }

  const path: string[] = [];
  let curr = endNodeId;
  let totalDistance = 0;
  let travelTime = 0;

  if (previous.has(curr) || curr === startNodeId) {
    while (curr) {
      path.unshift(curr);
      const prev = previous.get(curr);
      if (prev) {
        const edge = (graph.get(prev) || []).find(e => e.to === curr);
        if (edge) {
          totalDistance += edge.distance;
          travelTime += useCurrentTrafficTime ? edge.currentTravelTime : edge.baseTravelTime;
        }
      }
      curr = prev!;
    }
  }

  return { path, distance: totalDistance, travelTime, steps: [] };
}

export function dijkstraWithSteps(graph: Map<string, CityEdge[]>, startNodeId: string, endNodeId: string): DijkstraResult {
  const result = dijkstra(graph, startNodeId, endNodeId);
  result.steps = [{ stepNumber: 1, description: "Calculated full path", highlightNodes: result.path, highlightEdges: [] }];
  return result;
}
