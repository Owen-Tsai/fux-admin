<script setup lang="ts">
import type { TaskNodePropsMap } from '@fusionx/core/types'

const node = defineModel<TaskNodePropsMap['condition']>('node', { required: true })
</script>

<template>
  <TForm :data="node">
    <TFormItem label="条件表达式" help="使用 UEL 表达式">
      <TInput v-model="node.condition" />
    </TFormItem>
  </TForm>
</template>
