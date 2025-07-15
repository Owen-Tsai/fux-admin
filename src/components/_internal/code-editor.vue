<template>
  <Codemirror
    v-model="model"
    :extensions="extensions"
    class="code-editor"
    :style="height ? { height: `${height}px` } : {}"
  />
</template>

<script setup lang="ts">
import { Codemirror } from 'vue-codemirror'
import { minimalSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import type { Extension } from '@codemirror/state'

const { height } = defineProps<{
  height?: number
}>()

const extensions: Extension[] = [minimalSetup, javascript()]

const model = defineModel<string>()
</script>

<style lang="scss" scoped>
.code-editor {
  :deep(.cm-editor) {
    border-radius: var(--td-radius-medium);
    border: 1px solid var(--td-border-level-2-color);
    transition: all 0.2s;
    @apply flex-1 min-w-0;

    &.cm-focused {
      border-color: var(--td-brand-color);
      box-shadow: 0 0 0 2px var(--td-brand-color-focus);
      border-inline-end-width: 1px;
      outline: 0;
    }
    .cm-gutters,
    .cm-gutter,
    .cm-gutterElement {
      border-top-left-radius: var(--td-radius-medium);
      border-bottom-left-radius: var(--td-radius-medium);
    }
  }
}
</style>
