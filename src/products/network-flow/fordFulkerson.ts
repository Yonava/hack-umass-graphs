import type { GEdge, GNode, Graph } from "@graph/types";
import { SINK_LABEL, SOURCE_LABEL } from "./useFlowControls";
import { getAdjacencyList } from "./adjList";

// class Graph:
//     def __init__(self, size):
//         self.adj_matrix = [[0] * size for _ in range(size)]
//         self.size = size
//         self.vertex_data = [''] * size

//     def add_edge(self, u, v, c):
//         self.adj_matrix[u][v] = c

//     def add_vertex_data(self, vertex, data):
//         if 0 <= vertex < self.size:
//             self.vertex_data[vertex] = data

//     def dfs(self, s, t, visited=None, path=None):
//         if visited is None:
//             visited = [False] * self.size
//         if path is None:
//             path = []

//         visited[s] = True
//         path.append(s)

//         if s == t:
//             return path

//         for ind, val in enumerate(self.adj_matrix[s]):
//             if not visited[ind] and val > 0:
//                 result_path = self.dfs(ind, t, visited, path.copy())
//                 if result_path:
//                     return result_path

//         return None

//     def fordFulkerson(self, source, sink):
//         max_flow = 0

//         path = self.dfs(source, sink)
//         while path:
//             path_flow = float("Inf")
//             for i in range(len(path) - 1):
//                 u, v = path[i], path[i + 1]
//                 path_flow = min(path_flow, self.adj_matrix[u][v])

//             for i in range(len(path) - 1):
//                 u, v = path[i], path[i + 1]
//                 self.adj_matrix[u][v] -= path_flow
//                 self.adj_matrix[v][u] += path_flow

//             max_flow += path_flow

//             path_names = [self.vertex_data[node] for node in path]
//             print("Path:", " -> ".join(path_names), ", Flow:", path_flow)

//             path = self.dfs(source, sink)

//         return max_flow

// g = Graph(6)
// vertex_names = ['s', 'v1', 'v2', 'v3', 'v4', 't']
// for i, name in enumerate(vertex_names):
//     g.add_vertex_data(i, name)

// g.add_edge(0, 1, 3)  # s  -> v1, cap: 3
// g.add_edge(0, 2, 7)  # s  -> v2, cap: 7
// g.add_edge(1, 3, 3)  # v1 -> v3, cap: 3
// g.add_edge(1, 4, 4)  # v1 -> v4, cap: 4
// g.add_edge(2, 1, 5)  # v2 -> v1, cap: 5
// g.add_edge(2, 4, 3)  # v2 -> v4, cap: 3
// g.add_edge(3, 4, 3)  # v3 -> v4, cap: 3
// g.add_edge(3, 5, 2)  # v3 -> t,  cap: 2
// g.add_edge(4, 5, 6)  # v4 -> t,  cap: 6

// source = 0; sink = 5

// print("The maximum possible flow is %d " % g.fordFulkerson(source, sink))

const fordFulkerson = (graph: Graph) => {
  const nodes = structuredClone(graph.nodes.value)
  const originalEdges = structuredClone(graph.edges.value)
  const flippedEdges = originalEdges.map((e) => ({
    ...e,
    to: e.from,
    from: e.to,
    label: '0' // sets the weight of each residual to 0
  }))

  const edges = [...originalEdges, ...flippedEdges]

  const adjList = getAdjacencyList({ nodes, edges })

  const source = nodes.find((n) => n.label === SOURCE_LABEL)
  const sink = nodes.find((n) => n.label === SINK_LABEL)

  const edgeIdToWeight = edges.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.id] = Number(curr.label)
    return acc
  }, {})

  const visited = new Set<GNode['id']>()

  const dfs = (
    s: GNode['id'],
    t: GNode['id'],
    path: GNode['id'][] | undefined = undefined
  ): GNode['id'][] | undefined => {

    if (path === undefined) path = []
    visited.add(s)
    path.push(s)

    if (s === t) return path

    const adjacentNodeIds = adjList[s]
    for (const nodeId of adjacentNodeIds) {
      const connectingEdge = graph.edges.value.find((e) => e.from === s && e.to === nodeId)
      if (!connectingEdge) throw 'the adj list must be wrong!'
      const connectingEdgeWeight = edgeIdToWeight[connectingEdge.id]
      if (connectingEdgeWeight > 0 && !visited.has(nodeId)) {
        const resultPath = dfs(nodeId, t, [...path])
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
        if (!connectingEdge) throw 'the adj list must be wrong!'
        const connectingEdgeWeight = edgeIdToWeight[connectingEdge.id]
        pathFlow = Math.min(pathFlow, connectingEdgeWeight)
      }

      for (let i = 0; i < path.length - 1; i++) {
        const u = path[i]
        const v = path[i + 1]
        const connectingUV = edges.find((e) => e.from === u && e.to === v)
        const connectingVU = edges.find((e) => e.from === v && e.to === u)
        if (!connectingUV || !connectingVU) throw 'the adj list must be wrong!'
        edgeIdToWeight[connectingUV.id] -= pathFlow
        edgeIdToWeight[connectingVU.id] += pathFlow
      }

      maxFlow += pathFlow
      visited.clear()
      path = dfs(source.id, sink.id)
    }
  }
}