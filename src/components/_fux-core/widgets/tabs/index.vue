<template>
  <TTabs v-model:value="current" :theme="type">
    <TTabPanel v-for="(pane, i) in widget.props.children" :key="i" :label="pane.title" :value="i">
      <template v-if="ctx && ctx.mode !== 'dev'">
        <WidgetRenderer v-for="w in pane.widgets" :key="w.uid" :widget="w" />
      </template>
      <template v-else>
        <div class="draggable-area mt-4 p-1" :class="{ 'empty-slot': pane.widgets.length <= 0 }">
          <NestedWidgets :widgets="pane.widgets" />
        </div>
      </template>
    </TTabPanel>
  </TTabs>
</template>

<script setup lang="ts">
import { useRendererCtxInject } from '@fusionx/core/hooks'
import WidgetRenderer from '../widget/index.vue'
import NestedWidgets from '@fusionx/core/form-designer/canvas/nested.vue'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['tabs']
}>()

const current = ref(0)

const type = computed(() => (widget.props.type === 'line' ? 'normal' : widget.props.type))

const ctx = useRendererCtxInject()
</script>
