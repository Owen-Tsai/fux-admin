<template>
  <FileUpload
    v-model:value="model"
    :accept="widget.props.accept"
    :theme="widget.props.theme"
    :multiple="widget.props.multiple"
    :disabled="widget.props.disabled"
    :max="widget.props.max"
    :size-limit="widget.props.sizeLimit"
    :action="widget.props.action"
    :storage="widget.props.storage"
    @change="handler?.('change')"
  />
</template>

<script setup lang="ts">
import { useModel } from '@fusionx/core/hooks'
import { useEventHandlers } from '@fusionx/core/hooks'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['upload']
}>()

const model = useModel(widget)
const handler = useEventHandlers(widget.props.event)
</script>
