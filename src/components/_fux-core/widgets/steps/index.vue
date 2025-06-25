<template>
  <TSteps v-model:current="current">
    <TStepItem v-for="(step, i) in widget.props.children" :key="i" :content="step.desc">
      <template v-if="ctx && ctx.mode !== 'dev'">
        <WidgetRenderer v-for="w in step.widgets" :key="w.uid" :widget="w" />
      </template>
      <template v-else>
        <div class="draggable-area" :class="{ 'empty-slot': step.widgets.length <= 0 }">
          <NestedWidgets :widgets="step.widgets" />
        </div>
      </template>
    </TStepItem>
  </TSteps>
</template>

<script setup lang="ts">
import { useRendererCtxInject } from '@fusionx/core/hooks'
import WidgetRenderer from '../widget/index.vue'
import NestedWidgets from '@fusionx/core/form-designer/canvas/nested.vue'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['steps']
}>()

const current = ref(0)

const ctx = useRendererCtxInject()
</script>
