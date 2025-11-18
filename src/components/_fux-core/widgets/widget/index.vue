<template>
  <template v-if="widget.class === 'layout' && shouldShow">
    <component :is="widgetToRender(widget.type)" :widget="widget" />
  </template>
  <template v-if="widget.class === 'form' && shouldShow">
    <TFormItem
      v-if="visible || ctx === null"
      :help="widget.props.field.extra"
      :label="widget.props.field.label"
      :name="widget.props.field.name || widget.uid"
      :label-align="widget.props.field.labelAlign"
      :label-width="widget.props.field.labelWidth"
      :rules="rules"
      class="w-full"
    >
      <component :is="widgetToRender(widget.type)" :widget="widget" />
    </TFormItem>
  </template>
  <template v-if="widget.class === 'special'">
    <component :is="widgetToRender(widget.type)" :widget="widget" />
  </template>
</template>

<script setup lang="ts">
import { widgetToRender } from '@fusionx/core/utils/widget'
import { validation } from '@fusionx/core/utils'
import { useRendererCtxInject } from '@fusionx/core/hooks/use-context'
import useSignals from './use-signals'
import type { Widget, FormWidget, FieldInteractivity } from '@fusionx/core/types'

const ctx = useRendererCtxInject()

const widget = defineModel<Widget>('widget', { required: true })

const rules = computed(() => validation.generateRules(widget.value as FormWidget))

const interactivity = computed<FieldInteractivity['config'] | undefined>(() => {
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
  if (ctx?.mode === 'archive' || ctx?.mode === 'dev' || ctx === null) return true

  return interactivity.value !== 'hidden'
})

const setInteractivity = (prop: 'readonly' | 'disabled', val: boolean) => {
  ;(widget.value as FormWidget).props[prop] = val
}

const { visible } = useSignals(widget)

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
