<template>
  <TTabs v-model:value="current" :theme="type">
    <template v-for="(pane, i) in widget.props.children" :key="i">
      <TTabPanel
        v-if="ctx && ctx.mode !== 'dev' ? visible[i] || !pane.hide : true"
        :label="pane.title"
        :value="i"
      >
        <template #label>
          <div class="inline-flex items-center gap-1">
            {{ pane.title }}
            <Icon v-if="(!ctx || ctx.mode === 'dev') && pane.hide" name="browse-off-filled" />
          </div>
        </template>
        <template v-if="ctx && ctx.mode !== 'dev'">
          <div class="mt-4">
            <WidgetRenderer v-for="w in pane.widgets" :key="w.uid" :widget="w" />
          </div>
        </template>
        <template v-else>
          <div class="draggable-area mt-4 p-1" :class="{ 'empty-slot': pane.widgets.length <= 0 }">
            <NestedWidgets :widgets="pane.widgets" />
          </div>
        </template>
      </TTabPanel>
    </template>
  </TTabs>
</template>

<script setup lang="ts">
import { useRendererCtxInject } from '@fusionx/core/hooks'
import useStepVisibility from './use-step-visibility'
import WidgetRenderer from '../widget/index.vue'
import NestedWidgets from '@fusionx/core/form-designer/canvas/nested.vue'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['tabs']
}>()

const current = ref(0)

const type = computed(() => (widget.props.type === 'line' ? 'normal' : widget.props.type))

const ctx = useRendererCtxInject()

const { visible } = useStepVisibility(widget, current)
</script>
