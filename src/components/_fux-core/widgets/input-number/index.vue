<template>
  <TInputNumber
    v-model:value="model"
    :align="widget.props.align"
    :decimal-places="widget.props.precision"
    :default-value="widget.props.defaultValue"
    :disabled="widget.props.disabled"
    :max="widget.props.max"
    :min="widget.props.min"
    :placeholder="widget.props.placeholder"
    :readonly="widget.props.readonly"
    :step="widget.props.step"
    :theme="widget.props.controlsLayout"
    @change="handler('change')"
    @focus="handler('focus')"
    @blur="handler('blur')"
  />
</template>

<script setup lang="ts">
import { useModel } from '@fusionx/core/hooks'
import { useEventHandlers } from '@fusionx/core/hooks'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['inputNumber']
}>()

const model = useModel(widget)

const handler = useEventHandlers(widget.props.event)
</script>
