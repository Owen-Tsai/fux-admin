<template>
  <div>
    {{ displayValue }}
  </div>
</template>

<script setup lang="ts">
import { useRecordOptions } from '@fusionx/core/hooks'
import type { TdRadioGroupProps, RadioOptionObj } from 'tdesign-vue-next'
import type { WidgetMap } from '@fusionx/core/types'

const { widget, model } = defineProps<{
  widget: WidgetMap['radio']
  model: RadioOptionObj['value']
}>()

const options: Ref<TdRadioGroupProps['options'] | undefined> = useRecordOptions(widget)

const displayValue = computed<string>(() => {
  return (
    ((options.value?.find((item) => (item as RadioOptionObj).value === model) as RadioOptionObj)
      ?.label as string) || '/'
  )
})
</script>
