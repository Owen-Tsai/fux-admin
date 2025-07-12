<template>
  <div v-for="(item, i) in taskNodes" :key="item.uid">
    <StartNode v-if="item.type === 'start'" :config="item" @add-node="(type) => addNode(type, i)" />
    <ConditionNode
      v-if="item.type === 'condition'"
      :config="item"
      @add-node="(type) => addNode(type, i)"
      @delete-node="deleteNode(i, true)"
    />
    <ConditionGroup
      v-if="item.type === 'group'"
      :config="item"
      @add-node="(type) => addNode(type, i)"
    />
    <AuditNode
      v-if="item.type === 'audit'"
      :config="item"
      @add-node="(type) => addNode(type, i)"
      @delete-node="deleteNode(i)"
    />
  </div>
</template>

<script setup lang="ts">
import StartNode from './start/index.vue'
import ConditionNode from './condition/index.vue'
import ConditionGroup from './condition/group-wrapper.vue'
import AuditNode from './audit/index.vue'
import { initialTaskNodeConfig, generateId } from '@fusionx/core/utils'
import type { TaskNode, TaskNodeConfigMap } from '@fusionx/core/types'
import { cloneDeep } from 'lodash-es'

const taskNodes = defineModel<TaskNode[]>('taskNodes')
const emit = defineEmits<{
  (e: 'clear-branch', branchIdx: number): void
}>()

const addNode = (type: keyof TaskNodeConfigMap, pos: number) => {
  const nodeToAdd = cloneDeep(initialTaskNodeConfig[type])

  if (type === 'group') {
    ;(nodeToAdd as TaskNodeConfigMap['group']).props.children = [
      [
        {
          ...cloneDeep(initialTaskNodeConfig.condition),
          uid: generateId(),
          name: '条件1',
          type: 'condition',
        },
      ],
      [
        {
          ...cloneDeep(initialTaskNodeConfig.condition),
          uid: generateId(),
          name: '条件2',
          type: 'condition',
        },
      ],
    ]
  }

  taskNodes.value?.splice(pos + 1, 0, {
    ...nodeToAdd,
    uid: generateId(),
  })
}

const deleteNode = (pos: number, clearBranch?: boolean) => {
  taskNodes.value?.splice(pos, 1)

  if (clearBranch) {
    emit('clear-branch', pos)
  }
}

defineOptions({ name: 'TaskNodeRenderer' })
</script>
