<script setup lang="ts">
  import type { FlowSimulationControls } from "./useFlowSimulation";
  import Button from "@playground/ui/Button.vue";

  const props = defineProps<{
    simControls: FlowSimulationControls;
  }>();
</script>

<template>
  <div
    v-if="props.simControls.simulationActive.value"
    class="flex gap-3"
  >
    <Button @click="props.simControls.prevStep">Prev Step</Button>
    <Button @click="props.simControls.nextStep">Next Step</Button>
  </div>
</template>
