<template>
  <div>
    <TaskNodeRenderer :task-nodes="flowSchema.nodes" />
    <div class="node-wrapper">
      <div class="end-node">流程结束</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TaskNodeRenderer from '../task-nodes/index.vue'
import { useFlowBuilderCtxInject } from '@fusionx/core/hooks'

const { flowSchema } = useFlowBuilderCtxInject()!
</script>
