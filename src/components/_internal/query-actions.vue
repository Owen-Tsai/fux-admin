<template>
  <div class="inline-flex items-center justify-end gap-2">
    <TButton theme="primary" type="submit">查 询</TButton>
    <TButton theme="default" type="reset">重 置</TButton>
    <TLink
      v-if="expanded !== undefined && expanded !== null"
      theme="primary"
      @click="() => toggleExpanded()"
    >
      <Icon name="chevron-down" :class="{ 'rotate-180': expanded }" />
      {{ expanded ? '收起' : '展开' }}
    </TLink>
  </div>
</template>

<script setup lang="ts">
const { expanded } = defineProps<{
  expanded?: boolean | null
}>()

const emit = defineEmits<{
  (e: 'update:expanded', expanded: boolean): void
}>()

const toggleExpanded = () => {
  emit('update:expanded', !expanded)
}
</script>
