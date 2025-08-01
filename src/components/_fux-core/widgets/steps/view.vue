<template>
  <template v-if="paginated">
    <TTabs v-model:value="current">
      <TTabPanel v-for="(pane, i) in widget.props.children" :key="i" :label="pane.title" :value="i">
        <div class="mt-4">
          <ViewModeWidgetRenderer v-for="w in pane.widgets" :key="w.uid" :widget="w" />
        </div>
      </TTabPanel>
    </TTabs>
  </template>
  <template v-else>
    <div v-for="(col, i) in widget.props.children" :key="i">
      <h2 class="text-lg font-bold">{{ col.title }}</h2>
      <ViewModeWidgetRenderer v-for="field in col.widgets" :key="field.uid" :widget="field" />
    </div>
  </template>
</template>

<script setup lang="ts">
import ViewModeWidgetRenderer from '../widget/view-mode.vue'
import { useRendererCtxInject } from '@fusionx/core/hooks'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['steps']
}>()

const current = ref(0)

const ctx = useRendererCtxInject()

const paginated = computed(() => ctx?.appSchema.value?.info?.viewModePaginated)
</script>
