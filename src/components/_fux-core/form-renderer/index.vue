<template>
  <div>
    <TForm
      ref="formRef"
      :data="formData"
      :colon="appSchema.form.colon"
      :label-width="appSchema.form.labelWidth"
      :label-align="appSchema.form.labelAlign"
      :layout="appSchema.form.layout === 'vertical' ? 'vertical' : 'inline'"
      :disabled="appSchema.form.disabled || disabled"
    >
      <WidgetRenderer
        v-for="widget in appSchema.form.widgets"
        :key="widget.uid"
        :widget="widget"
        :field-override="fieldsControlOverride"
      />
    </TForm>

    <div v-if="debug">
      <div v-html="highlighted"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WidgetRenderer from '../widgets/widget/index.vue'
import highlightCode from '@/utils/highlighter'
import useAPI from './use-api'
import useInstance from './use-instance'
import { useRendererCtxProvide } from '@fusionx/core/hooks'
import type { FormInstanceFunctions, FormValidateParams } from 'tdesign-vue-next'
import type { AppSchema, FuxRendererMode, FieldControlOverride } from '@fusionx/core/types'

const {
  debug,
  disabled,
  mode = 'prod',
  taskKey,
} = defineProps<{
  debug?: boolean
  disabled?: boolean
  // 当前任务节点，为`all`时表示当前渲染在信息库模式
  taskKey?: string
  mode?: FuxRendererMode
}>()

const appSchema = defineModel<AppSchema>('appSchema', { required: true })
const state = defineModel<Record<string, any>>('state', { default: {} })

const formData = ref<Record<string, any>>({})

useRendererCtxProvide({
  $state: state,
  mode,
  formData,
  appSchema,
})

const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const highlighted = computedAsync(async () => {
  return await highlightCode(JSON.stringify(formData.value, null, 2), 'json')
})

const fieldsControlOverride = computed<FieldControlOverride[]>(() => {
  if (taskKey) {
    if (taskKey === 'all') {
      const fields: FieldControlOverride[] = []
      appSchema.value.flow.nodes.forEach((node) => {
        if (node.type === 'audit') {
          node.props.fieldsOverride.forEach((field) => {
            fields.push(field)
          })
        }
      })
      return fields
    }

    // 某一审核环节的任务节点配置的表单字段控制性覆写
    const currTask = appSchema.value.flow.nodes.find((node) => node.uid == taskKey)
    return (currTask?.props as any)?.fieldsOverride || []
  }

  return []
})

const instanceMethods = useInstance()
useAPI()

const validateForm = (params: FormValidateParams) => {
  return formRef.value?.validate(params)
}

const resetForm = () => {
  formRef.value?.reset()
}

defineExpose({
  ...instanceMethods,
  validateForm,
  resetForm,
})
</script>
