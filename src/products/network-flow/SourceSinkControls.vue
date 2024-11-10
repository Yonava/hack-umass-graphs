<script setup lang="ts">
  import type { NetworkFlowControls } from "./useFlowControls";
  import colors from "@utils/colors";
  import Button from "@playground/ui/Button.vue";
  import type { FlowSimulationControls } from "./useFlowSimulation";

  const props = defineProps<{
    simControls: FlowSimulationControls;
    controls: NetworkFlowControls;
  }>();
</script>

<template>
  <div class="flex gap-3">
    <Button
      v-if="!controls.makingSource.value"
      @click="controls.makeSource"
    >
      Make Source
    </Button>

    <Button
      v-else
      :style="{
        backgroundColor: colors.RED_500,
        color: colors.WHITE,
      }"
    >
      Cancel
    </Button>

    <Button
      v-if="!controls.makingSink.value"
      @click="controls.makeSink"
    >
      Make Sink
    </Button>

    <Button
      v-else
      :style="{
        backgroundColor: colors.RED_500,
        color: colors.WHITE,
      }"
    >
      Cancel
    </Button>
  </div>
</template>
