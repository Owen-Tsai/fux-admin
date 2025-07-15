<template>
  <TDrawer v-model:visible="visible" header="任务节点配置" size="30%">
    <AuditSetter v-if="selectedNode?.type === 'audit'" :node="selectedNode.props" />
    <ConditionSetter v-if="selectedNode?.type === 'condition'" :node="selectedNode.props" />
  </TDrawer>
</template>

<script setup lang="ts">
import { useFlowBuilderCtxInject } from '@fusionx/core/hooks'
import AuditSetter from '../task-nodes/audit/setter.vue'
import ConditionSetter from '../task-nodes/condition/setter.vue'

const visible = defineModel<boolean>('visible')

const { selectedNode } = useFlowBuilderCtxInject()!
</script>
