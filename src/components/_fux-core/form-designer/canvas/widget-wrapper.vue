<template>
  <div
    :class="
      cn('widget-wrapper !rounded-lg', {
        selected: selectedWidget?.uid === widget.uid,
        'is-form-widget': widget.class === 'form',
      })
    "
    @click.stop="selectedWidget = widget"
  >
    <slot></slot>

    <!-- 拖拽手柄 -->
    <div class="action drag-handle inline-flex absolute top-0 left-0 rounded-tl-lg cursor-move">
      <TIcon name="drag-move" />
    </div>
    <!-- caption -->
    <div class="caption">
      {{ widget.props.field.name || widget.uid }}
      <TIcon v-if="widget.props.hide" name="browse-off-filled" />
    </div>
    <!-- actions -->
    <div class="absolute bottom-0 right-0 flex gap-1">
      <TTooltip content="复制" :show-arrow="false" placement="left">
        <div class="action cursor-pointer" @click.stop="copyWidget(widget)">
          <TIcon name="copy-filled" />
        </div>
      </TTooltip>
      <TTooltip content="删除" :show-arrow="false" placement="right">
        <div class="action cursor-pointer rounded-br-lg" @click.stop="deleteWidget(widget.uid)">
          <TIcon name="delete-filled" />
        </div>
      </TTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import cn from 'classnames'
import { useDesignerCtxInject } from '@fusionx/core/hooks'
import type { Widget } from '@fusionx/core/types'

const { copyWidget, deleteWidget, selectedWidget } = useDesignerCtxInject()!

const { widget } = defineProps<{
  widget: Widget
}>()
</script>

<style lang="scss" scoped>
.action {
  background-color: var(--td-brand-color);
  color: var(--td-text-color-anti);
  opacity: 0;
  @apply inline-flex items-center justify-center p-1 -z-1;
}

.widget-wrapper {
  position: relative;
  outline: 2px dashed var(--td-border-level-1-color);
  @apply p-4;
  padding-top: 20px;
  padding-bottom: 22px;
  border-radius: var(--td-radius-md);
  user-select: none;

  &.selected {
    outline-style: solid;
    outline-color: var(--td-brand-color);
    & > .caption {
      color: var(--td-brand-color);
    }
    .action {
      opacity: 1;
      z-index: 10;
    }
  }

  &:not(.selected):hover {
    outline-color: var(--td-brand-color);
  }

  & + & {
    margin-top: 8px;
  }

  &.is-form-widget::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
  }
}

.caption {
  position: absolute;
  right: 4px;
  top: 0;
  font-size: var(--td-font-size-body-small);
  color: var(--td-font-gray-3);
  @apply font-mono;
}
</style>
