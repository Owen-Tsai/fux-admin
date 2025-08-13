<template>
  <TCascader
    :value="model"
    :check-strictly="widget.props.checkStrictly"
    :multiple="widget.props.multiple"
    :min-collapsed-num="0"
    :show-all-levels="widget.props.showAllLevels"
    :value-mode="widget.props.valueMode"
    value-type="single"
    readonly
    borderless
    :keys="keys"
    :options="options"
  />
</template>

<script setup lang="ts">
import { useTreeStructureOptions } from '@fusionx/core/hooks'
import { tryParse } from '@fusionx/core/utils'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['cascader']
  model: string | string[]
}>()

const options = useTreeStructureOptions(widget)

const keys = computed(() => tryParse(widget.props.fieldNames))
</script>
