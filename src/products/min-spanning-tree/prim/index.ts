import type { Graph, GEdge } from "@graph/types";
import { clone } from '@utils/clone';

export const usePrims = (graph: Graph) => {

  const getMinEdge = (edges: GEdge[], inMST: Set<string>): GEdge | null => {
    let minEdge: GEdge | null = null;

    for (const edge of edges) {
      if (!inMST.has(edge.from) || !inMST.has(edge.to)) {
        if (!minEdge || Number(edge.label) < Number(minEdge.label)) {
          minEdge = edge;
        }
      }
    }

    return minEdge;
  }

  const prims = () => {
    const mst: GEdge[] = [];
    const inMST: Set<string> = new Set(); 

    const startNode = graph.nodes.value[0].id;
    inMST.add(startNode);

    const allEdges: GEdge[] = Object.values(clone(graph.edges.value));

    while (mst.length < graph.nodes.value.length - 1) {
      const minEdge = getMinEdge(allEdges, inMST);

      if (minEdge) {
        mst.push(minEdge);
        inMST.add(minEdge.from);
        inMST.add(minEdge.to);
      } else {
        break;
      }
    }

    return mst;
  }

  return {
    prims,
  }
}
