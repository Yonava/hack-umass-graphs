<script setup lang="ts">
import type { GNode, Graph } from '@graph/types';
import colors from '@colors'

const props = defineProps<{
  graph: Graph;
}>()

const getNodeCosts = (node: GNode) => props.graph.getTheme('nodeText', node);
const costToColor = (strCost: string) => {
  if (strCost === 'Inf') return colors.RED_800
  const cost = Number(strCost)
  if (cost === Infinity || isNaN(cost)) return colors.GRAY_500
  if (cost === 0) return colors.GREEN_700
  if (cost < 3) return colors.GREEN_500
  if (cost < 5) return colors.YELLOW_500
  if (cost < 7) return colors.ORANGE_500
  if (cost < 9) return colors.RED_400
  return colors.RED_600
}
</script>

<template>
  <div
    v-for="node in graph.nodes.value"
    class="text-white flex items-center gap-3 p-2"
  >
    <span class="text-2xl w-6 text-center">
      {{ node.label }}
    </span>
    <span>
      →
    </span>
    <div
      class="text-lg rounded-lg h-8 w-16 grid place-items-center font-bold"
      :style="{ backgroundColor: costToColor(getNodeCosts(node)) }"
    >
      <span>
        {{ getNodeCosts(node) }}
      </span>
    </div>
  </div>
</template>