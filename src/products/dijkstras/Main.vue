<script setup lang="ts">
  import { ref } from "vue";
  import { useGraph } from "@graph/useGraph";
  import Graph from "@graph/Graph.vue";
  import { useSimulator } from "./useSimulator";
  import SimulatorControls from "./SimulatorControls.vue";
  import Button from "@playground/ui/Button.vue";
  import CostDisplay from "./CostDisplay.vue";

  const graphEl = ref<HTMLCanvasElement>();
  const graph = useGraph(graphEl, {
    settings: {
      persistentStorageKey: "dijkstras",
    },
  });

  const getNewLabel = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const labels = graph.nodes.value.map((node) => node.label);
    let label = 0;
    while (labels.includes(alphabet[label])) label++;
    return alphabet[label];
  };

  graph.subscribe('onNodeAdded', (node) => {
    node.label = getNewLabel();
  })

  const simControls = useSimulator(graph);
</script>

<template>
  <div class="w-full h-full relative">
    <Graph
      @graph-ref="(el) => (graphEl = el)"
      :graph="graph"
    />
  </div>

  <div class="absolute top-0 p-3 flex gap-3">
    <Button
      v-if="!simControls.active.value"
      @click="simControls.start"
    >
      Start Simulation
    </Button>

    <Button
      v-else
      @click="simControls.stop"
    >
      Stop Simulation
    </Button>
  </div>

  <div
    v-if="simControls.active.value"
    class="absolute p-3 mt-3 top-0 right-0 overflow-auto bg-gray-800 bg-opacity-80 rounded-l-xl"
  >
    <CostDisplay :graph="graph" />
  </div>

  <div class="absolute bottom-8 w-full flex justify-center items-center p-3">
    <SimulatorControls :controls="simControls" />
  </div>
</template>
