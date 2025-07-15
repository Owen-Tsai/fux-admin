<template>
  <template v-if="widget.class === 'layout' && shouldShow">
    <component
      :is="widgetToRender(widget.type)"
      :widget="cWidget"
      :field-override="fieldOverride"
    />
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
      <component :is="widgetToRender(widget.type)" :widget="cWidget" />
    </TFormItem>
  </template>
</template>

<script setup lang="ts">
import { widgetToRender } from '@fusionx/core/utils/widget'
import { validation } from '@fusionx/core/utils'
import { useRendererCtxInject } from '@fusionx/core/hooks/use-context'
import type { Widget, FormWidget, FieldControlOverride } from '@fusionx/core/types'

const ctx = useRendererCtxInject()

const { widget, fieldOverride } = defineProps<{
  /**
   * 低代码组件的配置
   */
  widget: Widget
  /**
   * 基于流程的节点字段控制性覆写
   */
  fieldOverride?: FieldControlOverride[]
}>()

const emit = defineEmits(['update:widget'])

const cWidget = computed({
  get: () => widget,
  set: (val) => emit('update:widget', val),
})

const rules = computed(() => validation.generateRules(widget as FormWidget))

const interactivity = computed<FieldControlOverride['config'] | undefined>(() => {
  if (widget.props.field.name) {
    const override = fieldOverride?.find((e) => e.name === widget.props.field.name)
    if (override) {
      return override.config
    }
  }

  return undefined
})

const shouldShow = computed(() => {
  if (ctx?.mode === 'archive' || ctx?.mode === 'dev') return true

  return interactivity.value !== 'hide'
})

const setInteractivity = (prop: 'readonly' | 'disabled', val: boolean) => {
  ;(cWidget.value as FormWidget).props[prop] = val
}

watchDebounced(
  () => interactivity.value,
  (val) => {
    if (val === 'edit') {
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
