<template>
  <div v-for="(item, i) in taskNodes" :key="item.uid"></div>
</template>

<script setup lang="ts">
import type { TaskNode } from '@fusionx/core/types'

const taskNodes = defineModel<TaskNode[]>('taskNodes')
</script>
