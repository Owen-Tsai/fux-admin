<template>
  <div>{{ displayValue }}</div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { WidgetMap } from '@fusionx/core/types'

const { widget, model } = defineProps<{
  widget: WidgetMap['datePicker']
  model: string | number
}>()

const displayValue = computed(() => {
  if (!model) {
    return ''
  }
  if (widget.props.displayFormat === 'time-stamp') {
    return dayjs(model).unix()
  } else if (widget.props.displayFormat === 'Date') {
    return new Date(model)
  } else {
    return dayjs(model).format(widget.props.displayFormat || 'YYYY-MM-DD HH:mm:ss')
  }
})
</script>
