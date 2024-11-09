<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import Graph from "@graph/Graph.vue";
  import Button from "@playground/ui/Button.vue";
  import { useFlowControls } from "./useFlowControls";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: {
      persistentStorageKey: "network-flow",
    },
  });

  const { makeSource, makeSink } = useFlowControls(graph);
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
      <Button>
        Hi
      </Button>
    </div>

  </div>
</template>
