<template>
  <div class="flex flex-wrap items-center gap-2">
    <TTag v-for="item in displayValue" :key="item">{{ item }}</TTag>
  </div>
</template>

<script setup lang="ts">
import { useModel, useRecordOptions } from '@fusionx/core/hooks'
import type { CheckboxGroupProps, CheckboxOptionObj } from 'tdesign-vue-next'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['checkbox']
}>()

const model = useModel(widget)

const options: Ref<CheckboxGroupProps['options'] | undefined> = useRecordOptions(widget)

const displayValue = computed<string[] | undefined>(() => {
  return options.value
    ?.filter((item) => model.value.includes((item as CheckboxOptionObj).value))
    .map((item) => ((item as CheckboxOptionObj).label as string) || '')
})
</script>
