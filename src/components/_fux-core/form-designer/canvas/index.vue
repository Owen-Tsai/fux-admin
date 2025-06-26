<template>
  <div ref="wrapperEl" class="h-full">
    <Scrollbar
      wrapper-class="!h-full"
      class="p-4 h-full"
      content-class="bg-[var(--td-bg-color-container)] min-h-full h-auto"
      :throttle-wait="100"
    >
      <TForm
        :colon="appSchema.form.colon"
        :label-width="appSchema.form.labelWidth"
        :label-align="appSchema.form.labelAlign"
        :layout="appSchema.form.layout === 'vertical' ? 'vertical' : 'inline'"
        :disabled="appSchema.form.disabled"
        class="min-h-full"
      >
        <Draggable
          :list="widgets"
          group="fux"
          :animation="200"
          item-key="uid"
          ghost-class="ghost"
          handle=".drag-handle"
          :swap-threshold="0.1"
          id="canvas"
          :style="{ minHeight: `${height - 48}px` }"
        >
          <template #item="{ element }: { element: Widget }">
            <WidgetWrapper :widget="element">
              <WidgetRenderer :widget="element" />
            </WidgetWrapper>
          </template>
        </Draggable>
      </TForm>
    </Scrollbar>
  </div>
</template>

<script setup lang="ts">
import { useDesignerCtxInject } from '@fusionx/core/hooks'
import Draggable from 'vuedraggable'
import WidgetRenderer from '@fusionx/core/widgets/widget/index.vue'
import WidgetWrapper from './widget-wrapper.vue'
import type { Widget } from '@fusionx/core/types'

const { appSchema } = useDesignerCtxInject()!
const widgets = ref(appSchema.value.form.widgets)

const wrapperEl = useTemplateRef('wrapperEl')
const { height } = useElementSize(wrapperEl)
</script>

<style lang="scss" scoped>
#canvas {
  width: 100%;
  padding: 16px;
}
</style>
