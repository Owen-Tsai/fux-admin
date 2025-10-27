<template>
  <template v-if="widget.class === 'layout' && shouldShow">
    <component :is="viewModeWidgetToRender(widget.type)" :widget="widget" />
  </template>
  <template v-if="widget.class === 'form' && shouldShow">
    <TFormItem
      :help="widget.props.field.extra"
      :label="widget.props.field.label"
      :name="widget.props.field.name || widget.uid"
      :label-align="widget.props.field.labelAlign"
      :label-width="widget.props.field.labelWidth"
      :rules="rules"
      class="w-full"
    >
      <component :is="viewModeWidgetToRender(widget.type)" :widget="widget" :model="fieldValue" />
    </TFormItem>
  </template>
</template>

<script setup lang="ts">
import { viewModeWidgetToRender } from '@fusionx/core/utils/widget'
import { validation } from '@fusionx/core/utils'
import { useRendererCtxInject } from '@fusionx/core/hooks/use-context'
import type { Widget, FormWidget, FieldInteractivity } from '@fusionx/core/types'

const ctx = useRendererCtxInject()

const widget = defineModel<Widget>('widget', { required: true })
const fieldValue = computed(
  () => ctx?.formData.value[widget.value.props.field.name || widget.value.uid],
)

const rules = computed(() => validation.generateRules(widget.value as FormWidget))

const interactivity = computed<FieldInteractivity['config'] | undefined>(() => {
  if (ctx?.mode === 'archive') return undefined
  if (widget.value.props.field.name) {
    const override = ctx?.fieldsInteractivity.value?.find(
      (e) => e.name === widget.value.props.field.name,
    )
    if (override) {
      return override.config
    }
  }

  return undefined
})

const shouldShow = computed(() => {
  if (ctx?.mode === 'archive' || ctx?.mode === 'dev') return true

  return interactivity.value !== 'hidden'
})

const setInteractivity = (prop: 'readonly' | 'disabled', val: boolean) => {
  ;(widget.value as FormWidget).props[prop] = val
}

watchDebounced(
  () => interactivity.value,
  (val) => {
    if (val === 'writable') {
      setInteractivity('readonly', false)
      setInteractivity('disabled', false)
    }
    if (val === 'readonly') {
      setInteractivity('readonly', true)
    }
  },
  { debounce: 100, immediate: true },
)
</script>
