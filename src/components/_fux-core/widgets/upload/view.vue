<template>
  <FileUpload :value="model" :theme="widget.props.theme" disabled />
</template>

<script setup lang="ts">
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['upload']
  model: string | string[]
}>()
</script>
