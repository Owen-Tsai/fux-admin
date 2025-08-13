<template>
  <TTreeSelect
    :value="model"
    :multiple="widget.props.multiple"
    :min-collapsed-num="0"
    :tree-props="treeProps"
    readonly
    borderless
    :keys="keys"
    :data="options"
  />
</template>

<script setup lang="ts">
import { useTreeStructureOptions } from '@fusionx/core/hooks'
import { tryParse } from '@fusionx/core/utils'
import type { WidgetMap } from '@fusionx/core/types'
import type { TreeSelectProps } from 'tdesign-vue-next'

const { widget } = defineProps<{
  widget: WidgetMap['treeSelect']
  model: string | string[]
}>()

const options = useTreeStructureOptions(widget)

const keys = computed(() => tryParse(widget.props.fieldNames))

const treeProps = computed<TreeSelectProps['treeProps']>(() => ({
  valueMode: widget.props.valueMode,
  lazy: widget.props.lazy,
  checkStrictly: widget.props.checkStrictly,
}))
</script>
