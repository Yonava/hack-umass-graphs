<script setup lang="ts">
import type { GNode, Graph } from '@graph/types';

const props = defineProps<{
  graph: Graph;
}>()

const getNodeCosts = (node: GNode) => props.graph.getTheme('nodeText', node);
</script>

<template>
  <div v-for="node in graph.nodes.value">
    <div>
      {{ node.label }} -
    </div>
    <div>
      {{ getNodeCosts(node) }}
    </div>
  </div>
</template>