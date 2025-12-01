<template>
  <TFormItem label="标题" name="title">
    <TInput v-model:value="props.title" clearable />
  </TFormItem>
  <TFormItem label="副标题" name="subtitle">
    <TInput v-model:value="props.subtitle" clearable />
  </TFormItem>
  <TFormItem label="标题分割线" name="headerBordered" class="boolean-setter">
    <TSwitch v-model:value="props.headerBordered" />
  </TFormItem>
</template>

<script setup lang="ts">
import type { WidgetMap } from '@fusionx/core/types'

const props = defineModel<WidgetMap['card']['props']>('props', { required: true })
</script>
