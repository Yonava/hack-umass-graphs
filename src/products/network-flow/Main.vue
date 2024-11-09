<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import Graph from "@graph/Graph.vue";
  import { useFlowControls } from "./useFlowControls";
  import colors from "@utils/colors";
  import SourceSinkControls from "./SourceSinkControls.vue";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: {
      persistentStorageKey: "network-flow",
      edgeInputToLabel: (input) => {
        const num = Number(input);
        const isValid = !isNaN(num) && num >= 0 && num < 100;
        return isValid ? input : undefined;
      }
    },
  });

  const controls = useFlowControls(graph);
</script>

<template>
  <div class="w-full h-full relative">
    <div class="absolute w-full h-full">
      <Graph
        @graph-ref="(el) => (graphEl = el)"
        :graph="graph"
      />
    </div>

    <div class="absolute top-0 p-3">
      <SourceSinkControls :controls="controls" />
    </div>
  </div>
</template>
