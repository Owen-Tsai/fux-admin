<script setup lang="ts">
import NodeButton from '../node-button.vue'
import { useFlowBuilderCtxInject } from '@fusionx/core/hooks'
import { TaskNodeActorStrategy } from '@fusionx/core/utils'
import type { TaskNodeConfigMap } from '@fusionx/core/types'

const config = defineModel<TaskNodeConfigMap['audit']>('config', { required: true })

const emit = defineEmits<{
  (e: 'add-node', type: keyof TaskNodeConfigMap): void
  (e: 'delete-node'): void
}>()

const isEditing = ref(false)
const inputEl = useTemplateRef<HTMLInputElement>('inputEl')

const { selectedNode } = useFlowBuilderCtxInject()!

const actors = computed(() => {
  const { strategy, text, value } = config.value.props.actor
  const dft = '点击设置审核人'
  if (!value && strategy !== TaskNodeActorStrategy.ORG) {
    return dft
  }

  // 角色
  if (strategy === 10) {
    if (value!.length > 1) {
      return `${text} 等 ${value!.length} 个角色`
    } else if (value!.length === 1 && text) {
      return `角色 ${text}`
    } else {
      return dft
    }
  }

  if (strategy === TaskNodeActorStrategy.ORG) {
    return text
  }

  return ''
})

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
  <div class="node-wrapper">
    <div class="node start-node">
      <div class="header">
        <div class="flex items-center gap-1">
          <TIcon name="seal" />
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

        <TIcon name="close" @click="emit('delete-node')" />
      </div>

      <div class="body" @click.stop="selectedNode = config">
        <div class="flex-between w-full">
          <div class="w-10/12">
            <div class="truncate">{{ actors }}</div>
          </div>
          <TIcon name="chevron-right" />
        </div>
      </div>
    </div>

    <NodeButton @click="onAddNode" />
  </div>
</template>
