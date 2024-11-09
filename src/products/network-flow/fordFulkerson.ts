import type { GEdge, GNode } from "@graph/types";
import { SINK_LABEL, SOURCE_LABEL } from "./useFlowControls";
import { getAdjacencyList } from "./adjList";

export const fordFulkerson = ({ nodes, edges }: { nodes: GNode[], edges: GEdge[] }) => {
  const edgeIdToWeight = edges.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.id] = Number(curr.label)
    return acc
  }, {})

  const tracker: Record<string, number>[] = []

  const adjList = getAdjacencyList({ nodes, edges })

  const source = nodes.find((n) => n.label === SOURCE_LABEL)
  const sink = nodes.find((n) => n.label === SINK_LABEL)

  const dfs = (
    s: GNode['id'],
    t: GNode['id'],
    visited: Set<string> | undefined = undefined,
    path: GNode['id'][] | undefined = undefined
  ): GNode['id'][] | undefined => {

    if (path === undefined) path = []
    if (visited === undefined) visited = new Set<string>()

    visited.add(s)
    path.push(s)

    if (s === t) return path

    const adjacentNodeIds = adjList[s]

    for (const nodeId of adjacentNodeIds) {
      const connectingEdge = edges.find((e) => e.from === s && e.to === nodeId)
      if (!connectingEdge) throw 'the adj list must be wrong! 1'
      const connectingEdgeWeight = edgeIdToWeight[connectingEdge.id]
      if (connectingEdgeWeight > 0 && !visited.has(nodeId)) {
        const resultPath = dfs(nodeId, t, visited, [...path])
        if (resultPath) return resultPath
      }
    }

    return undefined
  }

  const run = () => {
    if (!source || !sink) throw 'source/sink not in graph'
    let maxFlow = 0

    let path = dfs(source.id, sink.id)
    while (path) {
      let pathFlow = Infinity

      for (let i = 0; i < path.length - 1; i++) {
        const u = path[i]
        const v = path[i + 1]
        const connectingEdge = edges.find((e) => e.from === u && e.to === v)
        if (!connectingEdge) throw 'the adj list must be wrong! 2'
        const connectingEdgeWeight = edgeIdToWeight[connectingEdge.id]
        pathFlow = Math.min(pathFlow, connectingEdgeWeight)
      }

      for (let i = 0; i < path.length - 1; i++) {
        const u = path[i]
        const v = path[i + 1]
        const connectingUV = edges.find((e) => e.from === u && e.to === v)
        const connectingVU = edges.find((e) => e.from === v && e.to === u)
        if (!connectingUV || !connectingVU) throw 'the adj list must be wrong! 3'
        edgeIdToWeight[connectingUV.id] -= pathFlow
        edgeIdToWeight[connectingVU.id] += pathFlow
        tracker.push({
          [connectingUV.id]: edgeIdToWeight[connectingUV.id],
          [connectingVU.id]: edgeIdToWeight[connectingVU.id]
        })
      }

      maxFlow += pathFlow
      path = dfs(source.id, sink.id)
    }

    return maxFlow
  }

  return {
    maxFlow: run(),
    tracker
  }
}