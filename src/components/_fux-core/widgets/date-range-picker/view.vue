<template>
  <div>{{ displayValue.join(' - ') }}</div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { WidgetMap } from '@fusionx/core/types'

const { widget, model } = defineProps<{
  widget: WidgetMap['dateRangePicker']
  model: string[] | number[]
}>()

const displayValue = computed(() => {
  if (widget.props.valueType === 'time-stamp' || widget.props.valueType === 'Date') {
    return model.map((m) => dayjs(m).format('YYYY-MM-DD HH:mm:ss'))
  }

  return model.map((m) => dayjs(m).format(widget.props.valueType))
})
</script>
