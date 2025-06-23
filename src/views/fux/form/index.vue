<template>
  <div class="flex-1 min-h-0">
    <FormDesigner :app-schame="appSchema" />
  </div>
</template>

<script setup lang="ts">
import FormDesigner from '@fusionx/core/form-designer/index.vue'
import defaultSchema from '../default-schema'
import type { AppSchema } from '@/components/_fux-core/types'

const appSchema = ref<AppSchema>(defaultSchema)
</script>
