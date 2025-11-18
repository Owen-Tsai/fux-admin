<template>
  <TInput
    v-model:value="model"
    :align="widget.props.align"
    :default-value="widget.props.defaultValue"
    :clearable="widget.props.allowClear"
    :disabled="widget.props.disabled"
    :placeholder="widget.props.placeholder"
    :maxlength="widget.props.maxlength"
    :show-limit-number="widget.props.showCount"
    @change="handler?.('change')"
    @focus="handler?.('focus')"
    @blur="handler?.('blur')"
  >
    <template #prefix-icon v-if="widget.props.prefixIcon">
      <Icon :name="widget.props.prefixIcon" />
    </template>
  </TInput>
</template>

<script setup lang="ts">
import { useModel } from '@fusionx/core/hooks'
import { useEventHandlers } from '@fusionx/core/hooks'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['input']
}>()

const model = useModel(widget)

const handler = useEventHandlers(widget.props.event)
</script>
