<script setup lang="ts">
import { initialWidgetConfig, generateId } from '@fusionx/core/utils'
import { cloneDeep } from 'lodash-es'
import Draggable from 'vuedraggable'
import Item from './item.vue'
import type { Widget } from '@fusionx/core/types'

const filterText = ref('')
const widgetList = computed(() => {
  return Object.values(initialWidgetConfig).filter(
    (widget) => widget.name.includes(filterText.value) || widget.type.includes(filterText.value),
  )
})

const cloneWidget = (widget: Widget) => {
  const id = generateId()
  const ret = cloneDeep(widget)
  delete ret.icon
  ret.uid = id
  return ret
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div
      class="flex-none relative border-b border-b-[var(--td-border-level-1-color)] border-b-solid"
    >
      <TIcon
        name="search"
        class="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-[var(--td-text-level-3-color)]"
      />
      <input v-model="filterText" class="w-full border-none outline-none h-10 px-8" />
      <TIcon
        name="close"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[var(--td-text-level-3-color)]"
      />
    </div>
    <div class="flex-1 min-h-0 overflow-hidden">
      <Draggable
        :list="widgetList"
        :group="{ name: 'fux', pull: 'clone', put: false }"
        :sort="false"
        item-key="type"
        :clone="cloneWidget"
        :swap-threshold="0.5"
        class="p-4 grid grid-cols-2 gap-2"
      >
        <template #item="{ element }: { element: Widget; index: number }">
          <Item :widget="element" />
        </template>
      </Draggable>
    </div>
  </div>
</template>
