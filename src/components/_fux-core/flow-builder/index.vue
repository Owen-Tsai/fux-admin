<template>
  <div class="h-full bg-[var(--td-bg-color-secondarycontainer)] overflow-auto relative">
    <div class="sticky top-0 left-0 w-full bg-red-500/20">12345</div>

    <div class="w-full h-1200px bg-blue-500/20"></div>
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
