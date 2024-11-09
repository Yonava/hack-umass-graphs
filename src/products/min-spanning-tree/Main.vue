<script setup lang="ts">
import { ref } from "vue";
import { useGraph } from "@graph/useGraph";
import Graph from "@graph/Graph.vue";
import { useSetupGraph, edgeLabelIsPositiveNumber } from "./useSetupGraph";
import { useKruskal } from "./kruskal";

const graphEl = ref<HTMLCanvasElement>();
const graph = useGraph(graphEl, {
  settings: {
    persistentStorageKey: "min-spanning-tree",
    userEditableAddedEdgeType: "undirected",
    edgeInputToLabel: edgeLabelIsPositiveNumber
  },
});

useSetupGraph(graph);
const { kruskal } = useKruskal(graph)
console.log(kruskal())
</script>

<template>
  <div class="w-full h-full relative">
    <Graph 
      @graph-ref="(el) => (graphEl = el)" 
      :graph="graph" 
    />
  </div>
</template>
