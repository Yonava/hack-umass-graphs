import type { Graph, GEdge, GNode } from "@graph/types";
import { clone } from '@utils/clone'

export const useKruskal = (graph: Graph) => {
  const find = (parent: Map<string, string>, nodeId: string): string => {
    if (parent.get(nodeId) !== nodeId) {
      parent.set(nodeId, find(parent, parent.get(nodeId)!));
    }
    return parent.get(nodeId)!;
  };

  const union = (parent: Map<string, string>, rank: Map<string, number>, nodeA: string, nodeB: string) => {
    const rootA = find(parent, nodeA);
    const rootB = find(parent, nodeB);

    if (rootA !== rootB) {
      const rankA = rank.get(rootA)!;
      const rankB = rank.get(rootB)!;

      if (rankA < rankB) {
        parent.set(rootA, rootB);
      } else if (rankA > rankB) {
        parent.set(rootB, rootA);
      } else {
        parent.set(rootB, rootA);
        rank.set(rootA, rankA + 1);
      }
    }
  };

  const kruskal = () => {
    const sortedEdges: GEdge[] = Object.values(clone(graph.edges.value)).sort((a, b) => Number(a.label) - Number(b.label));

    const parent = new Map<string, string>();
    const rank = new Map<string, number>();

    graph.nodes.value.forEach(node => {
      parent.set(node.id, node.id);
      rank.set(node.id, 0);
    });

    const mst: GEdge[] = [];
    for (const edge of sortedEdges) {
      const sourceRoot = find(parent, edge.from);
      const targetRoot = find(parent, edge.to);

      if (sourceRoot !== targetRoot) {
        mst.push(edge);
        union(parent, rank, sourceRoot, targetRoot);

        if (mst.length === graph.nodes.value.length - 1) break;
      }
    }
    return mst;
  };

  return {
    kruskal,
  };
};
