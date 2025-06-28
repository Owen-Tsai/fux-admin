<template>
  <TEmpty v-if="appSchema.form.widgets.length <= 0" title="请添加组件进行配置" />
  <TEmpty v-else-if="selectedWidget === undefined" title="请选中组件进行配置" />
  <TForm v-else :data="appSchema" label-align="top" layout="inline">
    <TFormItem v-if="selectedWidget.class === 'form'" label="字段标签" name="label">
      <TInput v-model:value="selectedWidget.props.field.label" />
    </TFormItem>
    <TFormItem label="字段名称" name="name">
      <TInput v-model:value="selectedWidget.props.field.name" :placeholder="selectedWidget.uid" />
    </TFormItem>

    <template v-if="selectedWidget.class === 'form'">
      <TFormItem label="组件类型">
        <TSelect
          v-model:value="selectedWidget.type"
          :options="widgetTypeOpts"
          @change="onWidgetTypeChange"
        />
      </TFormItem>
      <TFormItem label="字段标签位置">
        <TSelect v-model:value="selectedWidget.props.field.labelAlign" :options="labelAlignOpts" />
      </TFormItem>
      <TFormItem label="标签列宽度" help="输入含单位的值(px/%/rem/...)">
        <TInput v-model:value="selectedWidget.props.field.labelWidth" />
      </TFormItem>
    </template>

    <component :is="compToRender" :props="selectedWidget.props" />

    <template v-if="selectedWidget.class === 'form'">
      <TFormItem label="是否必填" class="boolean-setter">
        <TSwitch
          v-model:value="selectedWidget.props.field.required"
          @change="validation.toggleRule(selectedWidget, 'required')"
        />
      </TFormItem>
      <TFormItem label="校验规则">
        <TSelect
          v-model:value="validateType"
          :options="validationOpts"
          clearable
          @change="onValidationTypeChange"
        />
        <!-- TODO: insert code editor -->
      </TFormItem>
      <pre>{{ validation.generateRules(selectedWidget) }}</pre>

      <!-- TODO: insert event handler -->
    </template>
  </TForm>
</template>

<script setup lang="ts">
import { useDesignerCtxInject } from '@fusionx/core/hooks'
import { initialWidgetConfig, validationOpts, validation } from '@fusionx/core/utils'
import { cloneDeep, kebabCase } from 'lodash-es'
import { labelAlignOpts } from './options'
import type { SelectProps } from 'tdesign-vue-next'
import type { WidgetMap, FormWidget } from '@fusionx/core/types'

const components = import.meta.glob('../../widgets/**/setter.vue', {
  eager: true,
  import: 'default',
})

const compToRender = computed(() => {
  if (!selectedWidget.value) return null
  const type = kebabCase(selectedWidget.value.type)
  const frag = components[`../../widgets/${type}/setter.vue`]
  return frag
})

const { appSchema, selectedWidget } = useDesignerCtxInject()!

const validateType = ref('')

const widgetTypeOpts = Object.keys(initialWidgetConfig).map((type) => ({
  label: initialWidgetConfig[type as keyof typeof initialWidgetConfig]?.name,
  value: type as keyof typeof initialWidgetConfig,
}))

const onWidgetTypeChange: SelectProps['onChange'] = (v) => {
  const newOpts = cloneDeep(initialWidgetConfig[v as keyof WidgetMap])
  if (!newOpts || !selectedWidget.value) return
  delete newOpts?.icon

  selectedWidget.value.type = newOpts.type
  selectedWidget.value.name = newOpts.name
  selectedWidget.value.props = {
    ...newOpts.props,
    field: {
      name: selectedWidget.value.props.field.name,
      label: selectedWidget.value.props.field.label,
    },
  }
}

const onValidationTypeChange: SelectProps['onChange'] = (v) => {
  if (v !== 'regexp' && v !== 'custom') {
    validation.removeRulesAndAdd(selectedWidget.value as FormWidget, v as string)
  } else {
    validation.removeRulesAndAdd(selectedWidget.value as FormWidget)
  }
}
</script>
