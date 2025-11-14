<template>
  <TRadioGroup
    v-model:value="model"
    :disabled="widget.props.disabled"
    :options="options"
    :allow-uncheck="widget.props.allowUncheck"
    :readonly="widget.props.readonly"
    :theme="theme"
    :variant="variant"
    @change="handler('change')"
  />
</template>

<script setup lang="ts">
import { useModel, useRecordOptions } from '@fusionx/core/hooks'
import { useEventHandlers } from '@fusionx/core/hooks'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['radio']
}>()

const model = useModel(widget)

const options = useRecordOptions(widget)

const handler = useEventHandlers(widget.props.event)

const variant = computed(() => {
  if (widget.props.variant === 'radio') return undefined
  return widget.props.variant
})

const theme = computed(() => {
  if (!widget.props.variant) return undefined
  return widget.props.variant === 'radio' ? 'radio' : 'button'
})
</script>
