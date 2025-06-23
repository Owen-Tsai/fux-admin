<script setup lang="ts">
import type { Widget } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: Widget
}>()
</script>

<template>
  <div
    class="select-none bg-[var(--td-bg-color-container)] transition-all duration-200 cursor-move group"
  >
    <div
      class="bg-[var(--td-bg-color-secondarycontainer)] rounded-lg p-4 flex-center group-hover:text-[var(--td-brand-color)]"
    >
      <TIcon :name="widget.icon" size="24px" />
    </div>
    <div
      class="text-center mt-2 group-hover:text-[var(--td-brand-color)] font-size-[var(--td-font-size-body-small)]"
    >
      <div>{{ widget.name }}</div>
      <div
        class="text-[var(--td-text-color-secondary)] group-hover:text-[var(--td-brand-color)] leading-none"
      >
        {{ widget.type }}
      </div>
    </div>
  </div>
</template>
