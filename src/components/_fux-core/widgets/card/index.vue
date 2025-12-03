<template>
  <TCard
    :title="widget.props.title"
    :subtitle="widget.props.subtitle"
    :header-bordered="widget.props.headerBordered"
    class="!my-4"
  >
    <template v-if="ctx && ctx.mode !== 'dev'">
      <WidgetRenderer v-for="w in widget.props.widgets" :key="w.uid" :widget="w" />
    </template>
    <template v-else>
      <div class="draggable-area p-1" :class="{ 'empty-slot': widget.props.widgets.length <= 0 }">
        <NestedWidgets :widgets="widget.props.widgets" />
      </div>
    </template>
  </TCard>
</template>

<script setup lang="ts">
import { useRendererCtxInject } from '@fusionx/core/hooks'
import WidgetRenderer from '../widget/index.vue'
import NestedWidgets from '@fusionx/core/form-designer/canvas/nested.vue'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['card']
}>()

const ctx = useRendererCtxInject()
</script>
