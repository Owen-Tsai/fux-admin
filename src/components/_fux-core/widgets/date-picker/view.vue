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
  if (widget.props.valueType === 'time-stamp' || widget.props.valueType === 'Date') {
    return dayjs(model).format('YYYY-MM-DD HH:mm:ss')
  }

  return dayjs(model).format(widget.props.valueType)
})
</script>
