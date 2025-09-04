<template>
  <TTextarea
    v-model:value="model"
    :autosize="size"
    :disabled="widget.props.disabled"
    :maxlength="widget.props.maxlength"
    :placeholder="widget.props.placeholder"
    :readonly="widget.props.readonly"
  />
</template>

<script setup lang="ts">
import { useModel } from '@fusionx/core/hooks'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['textarea']
}>()

const model = useModel(widget)

const size = computed(() => {
  if (widget.props.autoResize) return true
  return widget.props.minRows || widget.props.maxRows
    ? {
        minRows: widget.props.minRows,
        maxRows: widget.props.maxRows,
      }
    : undefined
})
</script>
