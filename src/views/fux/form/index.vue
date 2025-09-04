<template>
  <div class="flex-1 min-h-0">
    <FormDesigner :app-schame="appSchema" />
  </div>
</template>

<script setup lang="ts">
import FormDesigner from '@fusionx/core/form-designer/index.vue'
import { useAppDesignCtxInject } from '../use-app-design'

const { appSchema } = useAppDesignCtxInject()!
</script>
