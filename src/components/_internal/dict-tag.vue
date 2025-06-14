<script setup lang="ts">
import type { DictDataEntry } from '@/api/system/dict/data'
import type { TagProps } from 'tdesign-vue-next'

const { dictData, value } = defineProps<{
  dictData: DictDataEntry[]
  value?: string | number | boolean
}>()

const dictEntry = computed(() => {
  return dictData.find((item) => {
    if (typeof value === 'boolean') {
      return item.value === `${value}`
    }

    return item.value === value
  })
})

// tdesign compatibility
const THEME_KEYS = ['success', 'warning', 'default'] as const
const theme = computed<TagProps['theme'] | undefined>(() => {
  switch (dictEntry.value?.colorType) {
    case 'processing':
      return 'primary'
    case 'danger':
      return 'error'
    default:
      return THEME_KEYS.includes(dictEntry.value?.colorType as any)
        ? (dictEntry.value?.colorType as any)
        : undefined
  }
})
</script>

<template>
  <TTag v-if="dictEntry?.colorType" :theme="theme" variant="light-outline">{{
    dictEntry.label
  }}</TTag>
  <span v-else :class="dictEntry?.cssClass">{{ dictEntry?.label }}</span>
</template>
