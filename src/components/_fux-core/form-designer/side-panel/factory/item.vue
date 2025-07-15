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
      class="icon-wrapper bg-[var(--td-bg-color-secondarycontainer)] rounded-lg p-4 flex-center group-hover:text-[var(--td-brand-color)]"
    >
      <TIcon :name="widget.icon" size="24px" />
    </div>
    <div
      class="text-wrapper text-center mt-2 group-hover:text-[var(--td-brand-color)] font-size-[var(--td-font-size-body-small)]"
    >
      <div>{{ widget.name }}</div>
      <div
        class="text-[var(--td-text-color-secondary)] group-hover:text-[var(--td-brand-color)] leading-none scale-90"
      >
        {{ widget.type }}
      </div>
    </div>

    <div class="drag-placeholder">
      <div class="caption">添加到此处</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.drag-placeholder {
  display: none;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before {
    background-color: var(--td-brand-color);
    height: 4px;
    position: absolute;
    content: '';
    width: 100%;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 999px;
  }

  .caption {
    background-color: var(--td-brand-color);
    color: #fff;
    border-radius: 999px;
    padding: 2px 8px;
    font-size: var(--td-font-size-body-small);
    position: relative;
    z-index: 1;
  }
}
</style>
