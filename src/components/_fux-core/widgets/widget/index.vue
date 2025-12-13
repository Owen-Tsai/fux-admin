<template>
  <template v-if="widget.class === 'layout' && shouldRender">
    <component :is="widgetToRender(widget.type)" :widget="widget" />
  </template>
  <template v-if="widget.class === 'form' && shouldRender">
    <TFormItem
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
  <template v-if="widget.class === 'special' && shouldRender">
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

const { visible } = useSignals(widget)

/**
 * 计算是否渲染该控件
 * 1. 开发模式下始终渲染
 * 2. 预览模式下根据 hide 属性判断是否渲染
 * 3. 其他模式下，visible 的优先级始终高于 interactivity
 */
const shouldRender = computed(() => {
  if (!ctx || ctx.mode === 'dev') return true
  if (ctx.mode === 'preview') return widget.value.props.hide

  return visible.value !== undefined ? visible.value : interactivity.value !== 'hidden'
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
