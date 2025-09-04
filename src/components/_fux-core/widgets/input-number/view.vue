<template>
  <div>{{ model }}</div>
</template>

<script setup lang="ts">
import type { WidgetMap } from '@fusionx/core/types'

const { model } = defineProps<{
  widget: WidgetMap['inputNumber']
  model: number
}>()
</script>
