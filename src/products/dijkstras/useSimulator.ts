import { computed, ref } from "vue"
import type { GNode, Graph } from "@graph/types";
import { useDijkstraTrace } from "./dijkstras";
import { useTheme } from "@graph/themes/useTheme";
import colors from "@utils/colors";

export const useSimulator = (graph: Graph) => {

  const { trace } = useDijkstraTrace(graph)

  const { setTheme } = useTheme(graph, 'dijkstra');

  const step = ref(0);
  const paused = ref(true);
  const active = ref(false);
  const interval = ref<NodeJS.Timeout | undefined>()
  const isOver = computed(() => trace.value && step.value === trace.value.length - 1)
  const hasBegun = computed(() => step.value > 0)

  const traceAtStep = computed(() => trace.value && trace.value[step.value])

  const exploredNodeAtStep = computed(() => {
    const seenNodeIds = new Set<string>()
    return trace.value?.reduce<Set<string>[]>((acc, traceStep) => {
      const nodeIdsAtStep = new Set<string>()
      const thisStepsNodeIds = traceStep.exploredNodes.map((i) => i.id)
      for (const nodeId of thisStepsNodeIds) {
        if (seenNodeIds.has(nodeId)) continue
        seenNodeIds.add(nodeId)
        nodeIdsAtStep.add(nodeId)
      }
      acc.push(nodeIdsAtStep)
      return acc
    }, [])
  })

  const start = () => {
    paused.value = false
    active.value = true
    step.value = 0
    interval.value = setInterval(() => {
      if (isOver.value || paused.value) return
      nextStep()
    }, 1500)
  }

  const stop = () => {
    if (interval.value) clearInterval(interval.value)
    active.value = false
  }

  const nextStep = () => {
    if (!trace.value) return
    if (step.value === trace.value.length - 1) return
    step.value++

    graph.repaint('dijkstras/next-step')()
  }

  const prevStep = () => {
    if (step.value === 0) return
    step.value--

    graph.repaint('dijkstras/prev-step')()
  }

  const colorBorders = (node: GNode) => {
    if (graph.isHighlighted(node.id)) return

    // Source
    if (!traceAtStep.value) return
    if (traceAtStep.value.source.id === node.id) return colors.AMBER_600

    // Explored
    if (!exploredNodeAtStep.value) return;
    const idsInCurrStep = exploredNodeAtStep.value[step.value]
    if (idsInCurrStep.has(node.id)) return colors.BLUE_500
    else if (traceAtStep.value.exploredNodes.map(n => n.id).includes(node.id)) return colors.CYAN_500
  }

  const nodeDistanceText = (node: GNode) => {
    if (!traceAtStep.value) return
    const { distances } = traceAtStep.value
    const nodeDist = distances.find((dist) => dist.id === node.id)
    if (!nodeDist) return '?'
    if (nodeDist.distance === 1000) return 'Inf'
    return nodeDist.distance.toString()
  }

  setTheme('nodeBorderColor', colorBorders)
  setTheme('nodeText', nodeDistanceText)

  return {
    nextStep,
    prevStep,
    traceAtStep,

    start,
    stop,
    paused,

    isOver,
    hasBegun,
    active,
  }
}

export type DijkstraSimulatorControls = ReturnType<typeof useSimulator>