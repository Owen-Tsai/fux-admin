<template>
  <TEmpty v-if="appSchema.form.widgets.length <= 0" title="请添加组件进行配置" />
  <TEmpty v-else-if="selectedWidget === undefined" title="请选中组件进行配置" />
  <TForm v-else :data="appSchema" label-align="top" layout="inline" class="!w-full">
    <TFormItem label="UID">
      <TInput v-model:value="selectedWidget.uid" readonly>
        <template #suffix>
          <TTooltip content="复制">
            <TButton theme="primary" size="small" shape="square" @click="copy(selectedWidget.uid)">
              <template #icon>
                <Icon :name="copied ? 'check' : 'copy'" />
              </template>
            </TButton>
          </TTooltip>
        </template>
      </TInput>
    </TFormItem>
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

    <ValidationSetter />

    <ActionSetter />
  </TForm>
</template>

<script setup lang="ts">
import { useDesignerCtxInject } from '@fusionx/core/hooks'
import { initialWidgetConfig } from '@fusionx/core/utils'
import { cloneDeep, kebabCase } from 'lodash-es'
import { labelAlignOpts } from '../../utils/form-setter-opts'
import ValidationSetter from './validation-setter.vue'
import type { SelectProps } from 'tdesign-vue-next'
import type { WidgetMap } from '@fusionx/core/types'
import ActionSetter from './action-setter.vue'

const components = import.meta.glob('../**/setter.vue', {
  eager: true,
  import: 'default',
})

const compToRender = computed(() => {
  if (!selectedWidget.value) return null
  const type = kebabCase(selectedWidget.value.type)
  const frag = components[`../${type}/setter.vue`]
  return frag
})

const { appSchema, selectedWidget } = useDesignerCtxInject()!
const { copy, copied } = useClipboard({ source: selectedWidget.value?.uid })

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
</script>
