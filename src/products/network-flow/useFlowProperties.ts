import { readonly, ref } from "vue";
import type { GEdge, GNode, Graph } from "@graph/types";
import { SINK_ID, SOURCE_ID } from "./useFlowControls";
import { fordFulkerson } from "./fordFulkerson";

// Source node must have no inbound edges
// Sink node must have no outbound edges

const clone = (obj: any) => JSON.parse(JSON.stringify(obj))

export const useFlowProperties = (graph: Graph) => {

  const maxFlow = ref<number | undefined>()



  const recompute = async () => {
    cleanupResidualEdges()
    createResidualEdges()

    const src = graph.getNode(SOURCE_ID)
    const sink = graph.getNode(SINK_ID)
    if (!src || !sink) return

    const { maxFlow: res } = fordFulkerson(graph, src.id, sink.id)
    maxFlow.value = res
  }


  return {
    maxFlow: readonly(maxFlow),
  }
};

export type FlowProperties = ReturnType<typeof useFlowProperties>;