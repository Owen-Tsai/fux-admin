<template>
  <div
    class="relative before:content-[''] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2 before:w-full before:h-px before:bg-[var(--td-border-level-2-color)] my-4 flex flex-col"
  >
    <div class="content" :class="`is-${widget.props.align || 'left'}`">
      <div class="font-size-[var(--td-font-size-title-medium)] font-medium">
        {{ widget.props.title }}
      </div>
      <div v-if="widget.props.subtitle" class="text-xs text-[var(--td-text-color-secondary)]">
        {{ widget.props.subtitle }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['divider']
}>()
</script>

<style lang="scss" scoped>
.content {
  display: inline-flex;
  position: relative;
  flex-direction: column;
  background-color: var(--td-bg-color-container);
  padding: 0 0.5rem;
  &.is-left::before {
    content: '';
    left: 0;
    position: absolute;
    height: 100%;
    width: 0.25rem;
    background-color: var(--td-brand-color);
  }
  &.is-right::before {
    content: '';
    right: 0;
    position: absolute;
    height: 100%;
    width: 0.25rem;
    background-color: var(--td-brand-color);
  }

  &.is-left {
    align-self: flex-start;
    align-items: flex-start;
  }
  &.is-center {
    align-self: center;
    align-items: center;
  }
  &.is-right {
    align-self: flex-end;
    align-items: flex-end;
  }
}
</style>
