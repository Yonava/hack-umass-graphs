import { computed } from "vue";
import { getOutboundEdges } from "@graph/helpers";
import type { GNode, Graph } from "@graph/types";
import { SINK_LABEL, SOURCE_LABEL } from "./useFlowControls";

export const useFlowProperties = (graph: Graph) => {

  const minCut = computed(() => {
    const edges = graph.edges.value;
    const nodes = graph.nodes.value;

    const source = nodes.find(node => node.label === SOURCE_LABEL);
    const sink = nodes.find(node => node.label === SINK_LABEL);

    if (!source || !sink) return;

    const visited = new Set();

    const dfs = (node: GNode) => {
      if (visited.has(node)) return;
      visited.add(node);
      const edges = getOutboundEdges(node.id, graph);
      edges.forEach((edge) => {
        if (edge.to === sink.id) return;
        const toNode = graph.getNode(edge.to);
        if (!toNode) return;
        dfs(toNode);
      });
    }

    dfs(source);

    const cut = edges.filter(edge => {
      visited.has(graph.getNode(edge.from)) && !visited.has(graph.getNode(edge.to))
    });

    return cut.reduce((acc, edge) => acc + Number(edge.label), 0);
  })

  return {
    minCut
  }
};

export type FlowProperties = ReturnType<typeof useFlowProperties>;