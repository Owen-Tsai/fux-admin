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
const inputEl = useTemplateRef<HTMLInputElement>('inputEl')

const { selectedNode } = useFlowBuilderCtxInject()!

const onAddNode = (type: keyof TaskNodeConfigMap) => {
  emit('add-node', type)
}

const onEdit = () => {
  isEditing.value = true
  nextTick(() => {
    inputEl.value?.focus()
  })
}
</script>

<template>
  <div class="node-wrapper px-10 pt-8">
    <div class="node condition-node">
      <div class="header">
        <div class="flex items-center gap-1">
          <Icon name="seal" />
          <div class="input-wrapper">
            <TInput
              v-show="isEditing"
              v-model:value="config.name"
              ref="inputEl"
              class="node-name-input"
              size="small"
              @blur="isEditing = false"
              @enter="isEditing = false"
            />
            <span v-show="!isEditing" class="node-name" @click="onEdit">
              {{ config.name }}
            </span>
          </div>
        </div>

        <Icon name="close" class="cursor-pointer" @click="emit('delete-node')" />
      </div>

      <div class="body font-mono" @click="selectedNode = config">
        {{ config.props.condition || '请设置条件' }}
      </div>
    </div>

    <NodeButton @click="onAddNode" />
  </div>
</template>
