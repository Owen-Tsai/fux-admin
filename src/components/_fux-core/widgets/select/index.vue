<template>
  <TSelect
    v-model:value="model"
    :options="options"
    :placeholder="widget.props.placeholder"
    :disabled="widget.props.disabled"
    :readonly="widget.props.readonly"
    :clearable="widget.props.allowClear"
    :filterable="widget.props.filterable"
    :keys="keys"
    :creatable="widget.props.creatable"
    :multiple="widget.props.multiple"
    :max="widget.props.max"
    :min-collapsed-num="widget.props.minCollapsedNum"
    @change="handler?.('change')"
    @focus="handler?.('focus')"
    @blur="handler?.('blur')"
  />
</template>

<script setup lang="ts">
import { useModel, useRecordOptions } from '@fusionx/core/hooks'
import { tryParse } from '@fusionx/core/utils'
import { useEventHandlers } from '@fusionx/core/hooks'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['select']
}>()

const model = useModel(widget)

const handler = useEventHandlers(widget.props.event)

const keys = computed(() => tryParse(widget.props.fieldNames))

const options = useRecordOptions(widget)
</script>
