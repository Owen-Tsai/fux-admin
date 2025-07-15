<template>
  <TDateRangePicker
    v-model:value="model"
    :default-value="widget.props.defaultValue"
    :allow-input="widget.props.allowInput"
    :clearable="widget.props.allowClear"
    :disabled="widget.props.disabled"
    :format="widget.props.format"
    :mode="widget.props.mode"
    :placeholder="widget.props.placeholder"
    :readonly="widget.props.readonly"
    :disable-date="widget.props.disableDate"
    :value-type="widget.props.valueType"
  />
</template>

<script setup lang="ts">
import { useModel } from '@fusionx/core/hooks'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['dateRangePicker']
}>()

const model = useModel(widget)
</script>
