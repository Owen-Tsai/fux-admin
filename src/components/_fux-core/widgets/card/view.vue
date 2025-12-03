<template>
  <TCard
    :title="widget.props.title"
    :subtitle="widget.props.subtitle"
    :header-bordered="widget.props.headerBordered"
    class="!my-4"
  >
    <ViewModeWidgetRenderer v-for="w in widget.props.widgets" :key="w.uid" :widget="w" />
  </TCard>
</template>

<script setup lang="ts">
import ViewModeWidgetRenderer from '../widget/view-mode.vue'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['card']
}>()
</script>
