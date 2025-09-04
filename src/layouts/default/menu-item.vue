<script setup lang="ts">
import type { MenuItem } from './use-menu'

defineProps<{
  item: MenuItem
}>()
</script>

<template>
  <TSubmenu v-if="item.children && item.children.length > 0" :value="item.key" :title="item.label">
    <template #icon>
      <Icon v-if="item.tdIcon" :name="item.tdIcon" />
    </template>
    <MenuItem v-for="child in item.children" :key="child.key" :item="child" />
  </TSubmenu>
  <TMenuItem v-else :value="item.key">
    <template #icon>
      <Icon v-if="item.tdIcon" :name="item.tdIcon" />
    </template>
    {{ item.label }}
  </TMenuItem>
</template>
