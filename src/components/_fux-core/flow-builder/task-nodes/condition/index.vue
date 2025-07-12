<script setup lang="ts">
import NodeButton from '../node-button.vue'
import { useFlowBuilderCtxInject } from '@fusionx/core/hooks'
import type { TaskNodeConfigMap } from '@fusionx/core/types'

const config = defineModel<TaskNodeConfigMap['condition']>('config', { required: true })

const emit = defineEmits<{
  (e: 'add-node', type: keyof TaskNodeConfigMap): void
  (e: 'delete-node'): void
}>()

const isEditing = ref(false)

const { selectedNode } = useFlowBuilderCtxInject()!

const onAddNode = (type: keyof TaskNodeConfigMap) => {
  emit('add-node', type)
}
</script>

<template>
  <div class="node-wrapper">
    <div class="node condition-node">
      <div class="header">
        <div class="flex items-center gap-1">
          <TIcon name="seal" />
          <div class="input-wrapper">
            <span class="node-name">{{ config.name }}</span>
            <TInput
              v-show="isEditing"
              v-model:value="config.name"
              ref="inputEl"
              class="node-name-input"
              size="small"
              @blur="isEditing = false"
              @keydown.enter="isEditing = false"
            />
            <span v-show="!isEditing" class="node-name" @click="isEditing = true">
              {{ config.name }}
            </span>
          </div>
        </div>

        <TIcon name="close" @click="emit('delete-node')" />
      </div>

      <div class="body font-mono" @click="selectedNode = config">
        {{ config.props.condition || '请设置条件' }}
      </div>
    </div>

    <NodeButton @click="onAddNode" />
  </div>
</template>
