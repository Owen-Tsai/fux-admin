<template>
  <TRow
    :align="widget.props.align"
    :gutter="widget.props.gutter"
    :justify="widget.props.justify"
    class="w-full"
  >
    <TCol v-for="(col, i) in widget.props.children" :key="i" :span="col.span" class="min-w-0">
      <template v-if="ctx && ctx.mode !== 'dev'">
        <WidgetRenderer v-for="widget in col.widgets" :key="widget.uid" :widget="widget" />
      </template>
      <template v-else>
        <div class="draggable-area mt-4 p-1" :class="{ 'empty-slot': col.widgets.length <= 0 }">
          <NestedWidgets :widgets="col.widgets" />
        </div>
      </template>
    </TCol>
  </TRow>
</template>

<script setup lang="ts">
import { useRendererCtxInject } from '@fusionx/core/hooks'
import WidgetRenderer from '../widget/index.vue'
import NestedWidgets from '@fusionx/core/form-designer/canvas/nested.vue'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['grid']
}>()

const ctx = useRendererCtxInject()
</script>
