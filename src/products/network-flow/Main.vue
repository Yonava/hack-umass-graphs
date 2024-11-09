<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import Graph from "@graph/Graph.vue";
  import Button from "@playground/ui/Button.vue";
  import { useFlowControls } from "./useFlowControls";
import colors from "@utils/colors";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: {
      persistentStorageKey: "network-flow",
    },
  });

  const { makeSource, makingSource, makeSink, makingSink } =
    useFlowControls(graph);
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
      <Button
        v-if="!makingSource"
        @click="makeSource"
      >
        Make Source
      </Button>

      <Button
        v-else
        :style="{ backgroundColor: colors.RED_500, color: colors.WHITE }"
      >
        Cancel
      </Button>
    </div>
  </div>
</template>
