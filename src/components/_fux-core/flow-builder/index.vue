<template>
  <div class="h-full bg-[var(--td-bg-color-secondarycontainer)] overflow-auto">
    <div class="fixed top-0 left-1/2 -translate-x-1/2 h-full bg-red-500"></div>

    <div class="h-full w-full"></div>
  </div>
</template>

<script setup lang="ts">
import type { AppSchema, TaskNode } from '@fusionx/core/types'

const props = defineProps<{
  appSchema: AppSchema
}>()

const emit = defineEmits<{
  (e: 'update:appSchema', schema: AppSchema): void
}>()

const cAppSchema = computed({
  get: () => props.appSchema,
  set: (val) => emit('update:appSchema', val),
})
</script>
