import type { Graph } from "@graph/types";

export const RESIDUAL = 'residual'

export const useResidualEdges = (graph: Graph) => {

  const isResidual = (edgeId: string) => edgeId.startsWith(RESIDUAL)
  const getIdFromResidual = (residualId: string) => residualId.split('-')[1]

  const cleanupResidualEdges = () => {
    for (const edge of graph.edges.value) {
      if (!isResidual(edge.id)) continue
      const residualId = getIdFromResidual(edge.id)
      const correspondingEdge = graph.getEdge(residualId)
      if (!correspondingEdge) throw 'big oopsie'
      const corrEdgeWeight = Number(correspondingEdge.label)
      const resEdgeWeight = Number(edge.label)
      correspondingEdge.label = (corrEdgeWeight + resEdgeWeight).toString()
    }

    graph.edges.value = graph.edges.value.filter((e) => !e.id.startsWith(RESIDUAL))
    graph.repaint('edge-label-change')()
  }

  const createResidualEdges = () => {
    const residualsAlreadyExist = graph.edges.value.some((e) => e.id.startsWith(RESIDUAL))
    if (residualsAlreadyExist) return

    const residualEdges = graph.edges.value.map((e) => ({
      ...e,
      to: e.from,
      from: e.to,
      label: '0',
      id: `${RESIDUAL}-${e.id}`
    }))

    graph.edges.value.push(...residualEdges)
    graph.repaint('edge-label-change')()
  }

  return {
    cleanupResidualEdges,
    createResidualEdges,
    isResidual,
    getIdFromResidual
  }
}