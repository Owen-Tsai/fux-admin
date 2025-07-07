<script setup lang="ts">
import NodeButton from '../node-button.vue'
import type { TaskNodeConfigMap } from '@fusionx/core/types'

const { config } = defineProps<{
  config: TaskNodeConfigMap['start']
}>()

const emit = defineEmits<{
  (e: 'add-node', type: keyof TaskNodeConfigMap): void
}>()

const onAddNode = (type: keyof TaskNodeConfigMap) => {
  emit('add-node', type)
}
</script>

<template>
  <div class="node-wrapper">
    <div class="node start-node">
      <div class="header">
        <div class="flex items-center gap-1">
          <span class="node-name">{{ config.name }}</span>
        </div>
      </div>

      <div class="body">
        <div class="flex-between w-full">
          <div class="truncate">发起人</div>
        </div>
      </div>
    </div>

    <NodeButton @click="onAddNode" />
  </div>
</template>
