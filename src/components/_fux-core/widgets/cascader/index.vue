<template>
  <TCascader
    v-model:value="model"
    :clearable="widget.props.allowClear"
    :check-strictly="widget.props.checkStrictly"
    :default-value="widget.props.defaultValue"
    :filterable="widget.props.filterable"
    :disabled="widget.props.disabled"
    :placeholder="widget.props.placeholder"
    :multiple="widget.props.multiple"
    :max="widget.props.max"
    :min-collapsed-num="widget.props.minCollapsedNum"
    :show-all-levels="widget.props.showAllLevels"
    :lazy="widget.props.lazy"
    :value-mode="widget.props.valueMode"
    value-type="single"
    :readonly="widget.props.readonly"
    :keys="keys"
    :options="options"
    @change="handler?.('change')"
    @focus="handler?.('focus')"
    @blur="handler?.('blur')"
  />
</template>

<script setup lang="ts">
import { useModel, useTreeStructureOptions } from '@fusionx/core/hooks'
import { tryParse } from '@fusionx/core/utils'
import { useEventHandlers } from '@fusionx/core/hooks'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['cascader']
}>()

const model = useModel(widget)

const handler = useEventHandlers(widget.props.event)

const options = useTreeStructureOptions(widget)

const keys = computed(() => tryParse(widget.props.fieldNames))
</script>
