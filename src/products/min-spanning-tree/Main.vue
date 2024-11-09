<script setup lang="ts">
import { ref, computed } from "vue";
import { useGraph } from "@graph/useGraph";
import Graph from "@graph/Graph.vue";
import { useSetupGraph, edgeLabelIsPositiveNumber } from "./useSetupGraph";
import { useKruskal } from "./kruskal";
import { usePrims } from "./prim";
import { useColorizeGraph } from "./useColorizeGraph";
import Button from "@playground/ui/Button.vue";
import colors from "@utils/colors";

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
  kruskal,
  forwardStep: kForwardStep,
  backwardStep: kBackwardStep,
  canBackwardStep: kCanBackwardStep,
  canForwardStep: kCanForwardStep,
} = useKruskal(graph);

const {
  prims,
  forwardStep: pForwardStep,
  backwardStep: pBackwardStep,
  canBackwardStep: pCanBackwardStep,
  canForwardStep: pCanForwardStep,
} = usePrims(graph);

type Algorithms = "kruskal" | "prim" | undefined;

const currentAlgorithm = ref<Algorithms>(undefined);

const algorithms = [
  { label: "Kruskal", value: "kruskal" },
  { label: "Prim", value: "prim" },
  { label: "None", value: undefined },
] as const;

const colorizeGraph = () => {
  switch (currentAlgorithm.value) {
    case "kruskal":
      return useColorizeGraph(graph, kruskal());
    case "prim":
      return useColorizeGraph(graph, prims());
    default:
      return useColorizeGraph(graph, []);
  }
};

const updateAlgorithm = (newAlgorithm: Algorithms) => {
  currentAlgorithm.value = newAlgorithm;
  colorizeGraph();
};

const stepBackwards = () => {
  currentAlgorithm.value === 'kruskal' ? kBackwardStep() : pBackwardStep()
  colorizeGraph();
};

const stepForwards = () => {
  currentAlgorithm.value === 'kruskal' ? kForwardStep() : pForwardStep()
  colorizeGraph();
};

const computedCanForwardStep = computed(() => {
  return currentAlgorithm.value === 'kruskal' ? kCanForwardStep.value : pCanForwardStep.value
})
const computedCanBackwardStep = computed(() => {
  return currentAlgorithm.value === 'kruskal' ? kCanBackwardStep.value : pCanBackwardStep.value
})

const handleArrowKeys = (e: KeyboardEvent) => {
  if (e.key === '[' && computedCanBackwardStep.value) {
    stepBackwards()
  } else if (e.key === ']' && computedCanForwardStep.value) {
    stepForwards()
  }
}

graph.subscribe("onStructureChange", colorizeGraph);
graph.subscribe("onEdgeLabelChange", colorizeGraph);
graph.subscribe("onKeydown", handleArrowKeys)
</script>

<template>
  <div class="w-full h-full relative">
    <div class="absolute m-3 flex gap-3 z-50">
      <Button
        v-for="(algorithm, index) in algorithms"
        :key="index"
        @click="updateAlgorithm(algorithm.value)"
        :color="currentAlgorithm === algorithm.value ? colors.GREEN_500 : undefined"
      >
        {{ algorithm.label }}
      </Button>
    </div>
    <div
      v-if="currentAlgorithm"
      class="absolute m-3 flex gap-3 z-50 bottom-2 right-2"
    >
      <Button 
        @click="stepBackwards"
        :color="computedCanBackwardStep ? undefined : colors.SLATE_400"
        class="text-4xl px-4" 
      >←</Button>
      <Button 
        @click="stepForwards"
        :color="computedCanForwardStep ? undefined : colors.SLATE_400"
        class="text-4xl px-4" 
      >→</Button>
    </div>
    <Graph @graph-ref="(el) => (graphEl = el)" :graph="graph" />
  </div>
</template>
