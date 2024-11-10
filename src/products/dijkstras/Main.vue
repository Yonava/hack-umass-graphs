<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import Graph from "@graph/Graph.vue";
  import Button from "@playground/ui/Button.vue"
  import { useDijkstraTrace } from "./dijkstras"
  import { useTheme } from "@graph/themes/useTheme"
  import { useSimulator } from "./useSimulator.ts"

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: {
      persistentStorageKey: "dijkstras",
    }
  });

  const { dijkstras } = useDijkstraTrace(graph);
  const { nextStep, prevStep, traceAtStep } = useSimulator(graph)
  
</script>

<template>
  <div class="w-full h-full relative">
    <Graph
      @graph-ref="(el) => (graphEl = el)"
      :graph="graph"
    />
  </div>

  <div class="absolute top-0 m-3 flex gap-3">
    <Button @click="prevStep">
      Prev Step
    </Button>
      <Button @click="nextStep">
        Next Step
      </Button>
    </div>
</template>