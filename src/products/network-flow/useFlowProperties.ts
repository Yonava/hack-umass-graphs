import { computed } from "vue";
import { getInboundEdges, getOutboundEdges } from "@graph/helpers";
import type { GNode, Graph } from "@graph/types";
import { SINK_LABEL, SOURCE_LABEL } from "./useFlowControls";
import { minCostFlow} from "min-cost-flow";
import type { Edge as MinCostEdge } from "min-cost-flow";

// Source node must have no inbound edges
// Sink node must have no outbound edges

export const useFlowProperties = (graph: Graph) => {

  const formattedEdges = computed(() => {
    return graph.edges.value.map((edge) => {
      const newEdge: MinCostEdge = {
        capacity: Number(edge.label),
        cost: 0,
        from: edge.from,
        to: edge.to,
      };
    })
  });

  const minCut = computed(() => {
    const res = minCostFlow(graph);
  });

  return {}
};

export type FlowProperties = ReturnType<typeof useFlowProperties>;