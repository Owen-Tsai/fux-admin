<template>
  <TTreeSelect
    v-model:value="model"
    :clearable="widget.props.allowClear"
    :default-value="widget.props.defaultValue"
    :filterable="widget.props.filterable"
    :disabled="widget.props.disabled"
    :placeholder="widget.props.placeholder"
    :multiple="widget.props.multiple"
    :max="widget.props.max"
    :min-collapsed-num="widget.props.minCollapsedNum"
    :tree-props="treeProps"
    :readonly="widget.props.readonly"
    :keys="keys"
    :data="options"
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
import type { TreeSelectProps } from 'tdesign-vue-next'

const { widget } = defineProps<{
  widget: WidgetMap['treeSelect']
}>()

const model = useModel(widget)

const options = useTreeStructureOptions(widget)

const handler = useEventHandlers(widget.props.event)
const keys = computed(() => tryParse(widget.props.fieldNames))

const treeProps = computed<TreeSelectProps['treeProps']>(() => ({
  valueMode: widget.props.valueMode,
  lazy: widget.props.lazy,
  checkStrictly: widget.props.checkStrictly,
}))
</script>
