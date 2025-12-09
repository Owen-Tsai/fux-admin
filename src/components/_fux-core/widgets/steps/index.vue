<template>
  <template v-if="ctx && ctx.mode !== 'dev'">
    <TSteps :current="widget.props.state.current || 0">
      <template v-for="(step, i) in widget.props.children" :key="i">
        <TStepItem
          v-if="visible[i] || !step.hide"
          :title="step.title"
          :value="i"
          :content="step.desc"
        />
      </template>
    </TSteps>
    <div class="steps-container">
      <WidgetRenderer
        v-for="w in widget.props.children[widget.props.state.current || 0].widgets"
        :key="w.uid"
        :widget="w"
      />
    </div>
  </template>
  <template v-else>
    <TSteps v-model:current="current">
      <TStepItem
        v-for="(step, i) in widget.props.children"
        :key="i"
        :title="step.title"
        :value="i"
        :content="step.desc"
      />
    </TSteps>
    <div class="steps-container mt-2">
      <div
        class="draggable-area"
        :class="{ 'empty-slot': widget.props.children[current].widgets.length <= 0 }"
      >
        <NestedWidgets :widgets="widget.props.children[current].widgets" />
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { useRendererCtxInject } from '@fusionx/core/hooks'
import WidgetRenderer from '../widget/index.vue'
import useStepVisibility from '../tabs/use-step-visibility'
import NestedWidgets from '@fusionx/core/form-designer/canvas/nested.vue'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['steps']
}>()

const current = ref(0)

const ctx = useRendererCtxInject()

const { visible } = useStepVisibility(widget, current)
</script>
