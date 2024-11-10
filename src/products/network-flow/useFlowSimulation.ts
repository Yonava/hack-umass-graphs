import type { GEdge, Graph } from "@graph/types"
import { fordFulkerson } from "./fordFulkerson"
import { SINK_ID, SOURCE_ID } from "./useFlowControls"
import { ref } from "vue"
import { useTheme } from "@graph/themes/useTheme"
import colors from "@utils/colors"
import { getValue } from "@graph/helpers"

export const useFlowSimulation = (graph: Graph) => {

  const { setTheme } = useTheme(graph, 'flow')

  const activeEdgeIds = ref<string[]>([])
  const step = ref(0)
  const tracker = ref<Record<string, number>[]>([])

  const refreshTrace = async () => {
    const src = graph.getNode(SOURCE_ID)
    const sink = graph.getNode(SINK_ID)
    if (!src || !sink) return
    tracker.value = fordFulkerson(graph, src.id, sink.id).tracker
  }

  const nextStep = () => {
    if (step.value === tracker.value.length - 1) return
    step.value++
    const trackerAtStep = tracker.value[step.value]
    activeEdgeIds.value = Object.keys(trackerAtStep)
    const [edge1Id, edge2Id] = activeEdgeIds.value
    const edge1 = graph.getEdge(edge1Id)
    const edge2 = graph.getEdge(edge2Id)

    if (!edge1 || !edge2) throw 'this is all wrong!'
    edge1.label = trackerAtStep[edge1Id].toString()
    edge2.label = trackerAtStep[edge2Id].toString()
  }

  const prevStep = () => {
    if (step.value === 0) return
  }

  const colorActiveEdges = (edge: GEdge) => {
    const isActive = activeEdgeIds.value.includes(edge.id)
    if (isActive) return getValue(graph.theme.value.edgeFocusColor, edge)
    else if (edge.id.startsWith('residual')) return colors.ORANGE_400
  }

  setTheme('edgeColor', colorActiveEdges)

  graph.subscribe('onStructureChange', refreshTrace)

  return {
    nextStep,
    prevStep,
  }
}