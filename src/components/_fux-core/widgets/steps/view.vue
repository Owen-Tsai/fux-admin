<template>
  <template v-if="paginated">
    <TTabs v-model:value="current">
      <template v-for="(pane, i) in widget.props.children" :key="i">
        <TTabPanel v-if="visible[i] || !pane.hide" :label="pane.title" :value="i">
          <div class="mt-4">
            <ViewModeWidgetRenderer v-for="w in pane.widgets" :key="w.uid" :widget="w" />
          </div>
        </TTabPanel>
      </template>
    </TTabs>
  </template>
  <template v-else>
    <template v-for="(pane, i) in widget.props.children" :key="i">
      <div v-if="visible[i] || !pane.hide" class="mt-4">
        <h2 class="text-lg font-bold">{{ pane.title }}</h2>
        <ViewModeWidgetRenderer v-for="w in pane.widgets" :key="w.uid" :widget="w" />
      </div>
    </template>
  </template>
</template>

<script setup lang="ts">
import ViewModeWidgetRenderer from '../widget/view-mode.vue'
import { useRendererCtxInject } from '@fusionx/core/hooks'
import useStepVisibility from '../tabs/use-step-visibility'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['steps']
}>()

const current = ref(0)

const ctx = useRendererCtxInject()

const paginated = computed(() => ctx?.appSchema.value?.info?.viewModePaginated)

const { visible } = useStepVisibility(widget, current)
</script>
