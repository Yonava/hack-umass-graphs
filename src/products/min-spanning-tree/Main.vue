<script setup lang="ts">
import { ref, computed } from "vue";
import { useGraph } from "@graph/useGraph";
import Graph from "@graph/Graph.vue";
import { useSetupGraph, edgeLabelIsPositiveNumber } from "./useSetupGraph";
import Button from "@playground/ui/Button.vue";
import colors from "@utils/colors";
import { useState } from "./useState";

const graphEl = ref<HTMLCanvasElement>();
const graph = useGraph(graphEl, {
  settings: {
    persistentStorageKey: "min-spanning-tree",
    userEditableAddedEdgeType: "undirected",
    edgeInputToLabel: edgeLabelIsPositiveNumber,
  },
});

useSetupGraph(graph);

const {
  colorizeGraph,
  handleStepKeys,
  updateAlgorithm,
  runSimulation,
  setStep,
  stepBackwards,
  stepForwards,
  showSimulation,
  runningSimulation,
  currentAlgorithm,
  computedCanBackwardStep,
  computedCanForwardStep,
  algorithms,
  computedCurrentAlgorithmName,
  computedCurrentStep,
  computedMaxSteps,
} = useState(graph);

graph.subscribe("onStructureChange", colorizeGraph);
graph.subscribe("onEdgeLabelChange", colorizeGraph);
graph.subscribe("onKeydown", handleStepKeys);
</script>

<template>
  <div class="w-full h-full relative">
    <Button
      v-if="showSimulation"
      @click="(showSimulation = false), (runningSimulation = false)"
      class="absolute m-3 z-50"
      >Exit {{ computedCurrentAlgorithmName }} Simulation</Button
    >
    <div v-else class="absolute m-3 flex gap-3 z-50">
      <Button
        v-for="(algorithm, index) in algorithms"
        :key="index"
        @click="updateAlgorithm(algorithm.value)"
        :color="
          currentAlgorithm === algorithm.value ? colors.GREEN_500 : undefined
        "
      >
        {{ algorithm.label }}
      </Button>
    </div>
    <div
      v-if="currentAlgorithm && showSimulation"
      class="absolute m-3 flex gap-3 z-50 bottom-2 w-full justify-center items-end"
    >
      <Button
        @click="stepBackwards(), (runningSimulation = false)"
        :color="computedCanBackwardStep ? undefined : colors.SLATE_400"
        class="text-4xl h-24 w-24 rounded-full"
        >◀</Button
      >
      <div class="flex flex-col text-center text-white">
        <p class="mb-2">
          {{ computedCurrentStep }} / {{ computedMaxSteps }}
        </p>
        <Button @click="runSimulation" class="text-4xl h-24 w-24 rounded-full"
          >⏯</Button
        >
      </div>
      <Button
        @click="stepForwards(), (runningSimulation = false)"
        :color="computedCanForwardStep ? undefined : colors.SLATE_400"
        class="text-4xl h-24 w-24 rounded-full"
        >▶</Button
      >
    </div>
    <div
      v-else-if="currentAlgorithm"
      class="absolute m-3 flex z-50 bottom-2 flex justify-center w-full"
    >
      <Button @click="setStep(1), showSimulation = true, stepBackwards()" class="text-3xl"
        >Run Simulation</Button
      >
    </div>
    <Graph @graph-ref="(el) => (graphEl = el)" :graph="graph" />
  </div>
</template>
