<template>
  <TCheckboxGroup
    v-model:value="model"
    :disabled="widget.props.disabled"
    :readonly="widget.props.readonly"
    :max="widget.props.max"
    :options="options"
  />
</template>

<script setup lang="ts">
import { useModel, useRecordOptions } from '@fusionx/core/hooks'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['checkbox']
}>()

const model = useModel(widget)

const options = useRecordOptions(widget)
</script>
