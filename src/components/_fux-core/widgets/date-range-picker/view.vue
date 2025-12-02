<template>
  <div>{{ displayValue ? displayValue.join(' - ') : '' }}</div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { WidgetMap } from '@fusionx/core/types'

const { widget, model } = defineProps<{
  widget: WidgetMap['dateRangePicker']
  model: string[] | number[]
}>()

const displayValue = computed(() => {
  if (!model || model.length === 0) {
    return null
  }
  if (widget.props.displayFormat === 'time-stamp') {
    return model.map((m) => dayjs(m).unix())
  } else if (widget.props.displayFormat === 'Date') {
    return model.map((m) => new Date(m))
  } else {
    return model.map((m) => dayjs(m).format(widget.props.displayFormat || 'YYYY-MM-DD HH:mm:ss'))
  }
})
</script>
