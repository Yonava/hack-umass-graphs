import { readonly, ref } from "vue";
import type { GEdge, GNode, Graph } from "@graph/types";
import { SINK_LABEL, SOURCE_LABEL } from "./useFlowControls";
import { fordFulkerson } from "./fordFulkerson";
import { useTheme } from "@graph/themes/useTheme";
import colors from "@utils/colors";
import { getValue } from "@graph/helpers";

// Source node must have no inbound edges
// Sink node must have no outbound edges

const clone = (obj: any) => JSON.parse(JSON.stringify(obj))

export const useFlowProperties = (graph: Graph) => {

  const { setTheme } = useTheme(graph, 'flow')

  const maxFlow = ref<number | undefined>()

  const resetEdges = () => {
    for (const edge of graph.edges.value) {
      const isResidual = edge.id.startsWith('residual')
      if (isResidual) {
        const correspondingEdge = graph.getEdge(edge.id.split('-')[1])
        if (!correspondingEdge) throw 'big oopsie'
        const corrEdgeWeight = Number(correspondingEdge.label)
        const resEdgeWeight = Number(edge.label)
        correspondingEdge.label = (corrEdgeWeight + resEdgeWeight).toString()
      }
    }

    graph.edges.value = graph.edges.value.filter((e) => !e.id.startsWith('residual'))
    graph.repaint('edge-label-change')()
  }

  const createResidualEdges = () => {
    const residualEdges = graph.edges.value.map((e) => ({
      ...e,
      to: e.from,
      from: e.to,
      label: '0',
      id: `residual-${e.id}`
    }))

    graph.edges.value.push(...residualEdges)
    graph.repaint('edge-label-change')()
  }

  const activeEdgeIds = ref<string[]>([])

  const recompute = async () => {
    resetEdges()
    createResidualEdges()
    const src = graph.nodes.value.find((n) => n.label === SOURCE_LABEL)
    const sink = graph.nodes.value.find((n) => n.label === SINK_LABEL)
    if (!src || !sink) return

    const nodes = clone(graph.nodes.value) as GNode[]
    const edges = clone(graph.edges.value) as GEdge[]

    const { maxFlow: res, tracker } = fordFulkerson({ nodes, edges })
    for (let i = 0; i < tracker.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      activeEdgeIds.value = Object.keys(tracker[i])
      graph.repaint('edge-label-change')()

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const [edge1Id, edge2Id] = activeEdgeIds.value

      const edge1 = graph.getEdge(edge1Id)
      const edge2 = graph.getEdge(edge2Id)

      if (!edge1 || !edge2) throw 'this is all wrong!'
      edge1.label = tracker[i][edge1Id].toString()
      edge2.label = tracker[i][edge2Id].toString()
      graph.repaint('edge-label-change')()

      maxFlow.value = res
    }
    activeEdgeIds.value = []
    graph.repaint('edge-label-change')()
  }

  setTheme('edgeColor', (e) => {
    if (activeEdgeIds.value.includes(e.id)) return getValue(graph.theme.value.edgeFocusColor, e)
    else if (e.id.startsWith('residual')) return colors.ORANGE_400
  })

  return {
    maxFlow: readonly(maxFlow),
    recompute,
    createResidualEdges,
    resetEdges
  }
};

export type FlowProperties = ReturnType<typeof useFlowProperties>;