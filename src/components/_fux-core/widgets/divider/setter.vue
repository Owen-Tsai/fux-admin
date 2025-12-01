<template>
  <TFormItem label="标题" name="title">
    <TInput v-model:value="props.title" clearable />
  </TFormItem>
  <TFormItem label="副标题" name="subtitle">
    <TInput v-model:value="props.subtitle" clearable />
  </TFormItem>
  <TFormItem label="标题对齐" name="align">
    <TSelect v-model:value="props.align" :options="alignOptions" />
  </TFormItem>
</template>

<script setup lang="ts">
import type { WidgetMap } from '@fusionx/core/types'

const alignOptions = [
  { label: '左对齐', value: 'left' },
  { label: '居中对齐', value: 'center' },
  { label: '右对齐', value: 'right' },
]

const props = defineModel<WidgetMap['divider']['props']>('props', { required: true })
</script>
