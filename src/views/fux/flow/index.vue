<template>
  <div class="flex-1 min-h-0">
    <FlowBuilder :app-schema="appSchema" />
  </div>
</template>

<script setup lang="ts">
import FlowBuilder from '@fusionx/core/flow-builder/index.vue'
import { useAppDesignCtxInject } from '../use-app-design'

const { appSchema } = useAppDesignCtxInject()!
</script>
