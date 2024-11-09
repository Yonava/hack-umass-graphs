import type { Graph, GEdge } from "@graph/types";
import { clone } from "@utils/clone";
import { ref, computed } from "vue";

export const usePrims = (graph: Graph) => {
  const currentStep = ref(graph.nodes.value.length - 1);

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
    const inMST = new Set<string>();

    const startNode = graph.nodes.value[0].id;
    inMST.add(startNode);

    const allEdges: GEdge[] = Object.values(clone(graph.edges.value));

    while (
      mst.length < graph.nodes.value.length - 1 &&
      mst.length < currentStep.value
    ) {
      const minEdge = getMinEdge(allEdges, inMST);

      if (!minEdge) {
        break;
      }

      mst.push(minEdge);
      inMST.add(minEdge.from);
      inMST.add(minEdge.to);
    }

    return mst;
  };

  const canBackwardStep = computed(() => {
    return currentStep.value > 1;
  });

  const canForwardStep = computed(() => {
    return currentStep.value < graph.nodes.value.length - 1;
  });

  const forwardStep = () => {
    if (canForwardStep) currentStep.value++;
  };

  const backwardStep = () => {
    if (canBackwardStep.value) currentStep.value--;
  };

  return {
    prims,
    backwardStep,
    forwardStep,
    canBackwardStep,
    canForwardStep,
  };
};
