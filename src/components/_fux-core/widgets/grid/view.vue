<template>
  <TRow
    :align="widget.props.align"
    :gutter="widget.props.gutter"
    :justify="widget.props.justify"
    class="w-full"
  >
    <TCol v-for="(col, i) in widget.props.children" :key="i" :span="col.span" class="min-w-0">
      <ViewModeWidgetRenderer v-for="widget in col.widgets" :key="widget.uid" :widget="widget" />
    </TCol>
  </TRow>
</template>

<script setup lang="ts">
import ViewModeWidgetRenderer from '../widget/view-mode.vue'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['grid']
}>()
</script>
