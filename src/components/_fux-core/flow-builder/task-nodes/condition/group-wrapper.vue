<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { initialTaskNodeConfig, generateId } from '@fusionx/core/utils'
import NodeButton from '../node-button.vue'
import NodeRenderer from '../index.vue'
import type { TaskNodeConfigMap } from '@fusionx/core/types'

const config = defineModel<TaskNodeConfigMap['group']>('config', { required: true })

const emit = defineEmits<{
  (e: 'add-node', type: keyof TaskNodeConfigMap): void
  (e: 'delete-node'): void
}>()

const onAddNode = (type: keyof TaskNodeConfigMap) => {
  emit('add-node', type)
}

const addBranch = () => {
  config.value.props.children.push([
    {
      ...cloneDeep(initialTaskNodeConfig.condition),
      uid: generateId(),
      name: `条件${config.value.props.children.length + 1}`,
    },
  ])
}

const deleteBranch = (branchIdx: number) => {
  if (config.value.props.children.length === 2) {
    emit('delete-node')
  } else {
    config.value.props.children.splice(branchIdx, 1)
  }
}
</script>

<template>
  <div class="conditional-group">
    <div class="text-center relative z-2">
      <AButton shape="round" @click="addBranch">添加条件</AButton>
    </div>
    <div class="node-wrapper -mt-4 z-1">
      <div class="branches">
        <div class="branch" v-for="(subNodes, branchIdx) in config.props.children" :key="branchIdx">
          <NodeRenderer :task-nodes="subNodes" @delete-branch="deleteBranch(branchIdx)" />
          <div v-if="branchIdx === 0" class="edge-line line-tl"></div>
          <div v-if="branchIdx === 0" class="edge-line line-bl"></div>
          <div
            v-if="branchIdx === config.props.children.length - 1"
            class="edge-line line-tr"
          ></div>
          <div
            v-if="branchIdx === config.props.children.length - 1"
            class="edge-line line-br"
          ></div>
        </div>
      </div>
      <div>
        <NodeButton @click="onAddNode" />
      </div>
    </div>
  </div>
</template>
