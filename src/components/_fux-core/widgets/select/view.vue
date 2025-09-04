<template>
  <div v-if="widget.props.multiple" class="flex items-center gap-2 flex-wrap">
    <TTag v-for="item in displayValue" :key="item">{{ item }}</TTag>
  </div>
  <div v-else>
    {{ displayValue }}
  </div>
</template>

<script setup lang="ts">
import { useRecordOptions } from '@fusionx/core/hooks'
import { tryParse } from '@fusionx/core/utils'
import type { TdSelectProps } from 'tdesign-vue-next'
import type { WidgetMap } from '@fusionx/core/types'

const { widget, model } = defineProps<{
  widget: WidgetMap['select']
  model: string | string[]
}>()

const keys = computed<TdSelectProps['keys']>(() => tryParse(widget.props.fieldNames, {}))

const options: Ref<TdSelectProps['options'] | undefined> = useRecordOptions(widget)

const displayValue = computed<string | string[]>(() => {
  const valueKey = keys.value?.value || 'value'
  const labelKey = keys.value?.label || 'label'

  if (Array.isArray(model)) {
    return model.map(
      (item) => (options.value?.find((i) => (i as any)[valueKey] === item) as any)?.[labelKey],
    )
  }

  return (options.value?.find((item) => (item as any)[valueKey] === model) as any)?.[labelKey]
})
</script>
