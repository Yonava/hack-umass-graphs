import type { GEdge, Graph } from "@graph/types"
import { fordFulkerson } from "./fordFulkerson"
import { SINK_LABEL, SOURCE_LABEL } from "./useFlowControls"
import { ref } from "vue"
import { useTheme } from "@graph/themes/useTheme"
import colors from "@utils/colors"
import { getValue } from "@graph/helpers"
import { useResidualEdges } from "./useResidualEdges"

export const useFlowSimulation = (graph: Graph) => {

  const { setTheme } = useTheme(graph, 'flow')

  const { createResidualEdges, cleanupResidualEdges } = useResidualEdges(graph)

  const simulationActive = ref(false)
  const activeEdgeIds = ref<string[]>([])
  const step = ref(0)
  const tracker = ref<Record<string, number>[]>([])

  const refreshTrace = async () => {
    createResidualEdges()

    const src = graph.nodes.value.find(n => n.label === SOURCE_LABEL)
    const sink = graph.nodes.value.find(n => n.label === SINK_LABEL)
    if (!src || !sink) return cleanupResidualEdges()
    tracker.value = fordFulkerson(graph, src.id, sink.id).tracker
    cleanupResidualEdges()
  }

  const startSimulation = () => {
    step.value = 0
    graph.settings.value.userEditable = false
    graph.settings.value.focusable = false
    simulationActive.value = true
    createResidualEdges()
    nextStep()
  }

  const stopSimulation = () => {
    cleanupResidualEdges()
    graph.settings.value.userEditable = true
    graph.settings.value.focusable = true
    simulationActive.value = false
  }

  const nextStep = () => {
    if (step.value === tracker.value.length - 1) return

    const trackerAtStep = tracker.value[step.value]
    activeEdgeIds.value = Object.keys(trackerAtStep)
    const [edge1Id, edge2Id] = activeEdgeIds.value
    const edge1 = graph.getEdge(edge1Id)
    const edge2 = graph.getEdge(edge2Id)

    if (!edge1 || !edge2) throw 'this is all wrong!'
    edge1.label = trackerAtStep[edge1Id].toString()
    edge2.label = trackerAtStep[edge2Id].toString()

    step.value++
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
  graph.subscribe('onEdgeLabelChange', refreshTrace)

  return {
    nextStep,
    prevStep,
    startSimulation,
    stopSimulation,
    simulationActive,
  }
}