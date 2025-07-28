<template>
  <svg :class="['t-icon', 'fux-icon', fullName]" v-bind="$attrs">
    <use :href="`#${fullName}`"></use>
  </svg>
</template>

<script setup lang="ts">
const { name } = defineProps<{
  name: string
}>()

const fullName = computed(() => `t-icon-${name}`)
</script>
