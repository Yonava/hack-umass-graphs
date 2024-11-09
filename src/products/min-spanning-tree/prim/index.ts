import type { Graph, GEdge } from "@graph/types";
import { clone } from "@utils/clone";
import { ref } from "vue";

export const usePrims = (graph: Graph) => {
  const currentStep = ref(2);
  const mstSteps = ref<GEdge[][]>([]);

  const getMinEdge = (edges: GEdge[], inMST: Set<string>): GEdge | null => {
    let minEdge: GEdge | null = null;

    for (const edge of edges) {
      if (
        (inMST.has(edge.from) && !inMST.has(edge.to)) ||
        (inMST.has(edge.to) && !inMST.has(edge.from))
      ) {
        if (!minEdge || Number(edge.label) < Number(minEdge.label)) {
          minEdge = edge;
        }
      }
    }

    return minEdge;
  };

  const prims = () => {
    if (graph.nodes.value.length === 0) return [];

    const mst: GEdge[] = [];
    const inMST: Set<string> = new Set();

    const startNode = graph.nodes.value[0].id;
    inMST.add(startNode);

    const allEdges: GEdge[] = Object.values(clone(graph.edges.value));

    while (mst.length < graph.nodes.value.length - 1) {
      const minEdge = getMinEdge(allEdges, inMST);

      if (!minEdge) {
        break;
      }

      mst.push(minEdge);
      mstSteps.value.push([...mst]);
      inMST.add(minEdge.from);
      inMST.add(minEdge.to);
    }

    return mst;
  };

  const forwardStep = () => {
    if (currentStep.value < mstSteps.value.length - 1) {
      currentStep.value++;
    }
  };

  const backwardStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--;
    }
  };

  return {
    prims,
    backwardStep,
    forwardStep,
    currentStep,
  };
};
