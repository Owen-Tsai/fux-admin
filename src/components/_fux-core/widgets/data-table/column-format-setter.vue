<script setup lang="ts">
import { getSimpleDictTypeList } from '@/api/system/dict/type'
import type { WPropsTableColumn } from '../../types/form/layout-widgets'
import type { FormInstanceFunctions } from 'tdesign-vue-next'
import type { WidgetMap } from '@fusionx/core/types'

const props = defineModel<WidgetMap['dataTable']['props']>('props', { required: true })
const activeColumn = ref<WPropsTableColumn>()

const formatter = ref<WPropsTableColumn['formatter']>({
  type: '',
  value: '',
})

const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const visible = ref(false)

const open = (column: WPropsTableColumn) => {
  formRef.value?.reset()
  formatter.value = column.formatter
  visible.value = true
}

const formatterOpts = [
  { label: '不设置', value: '' },
  { label: '图片', value: 'image' },
  { label: '字典', value: 'dict' },
  { label: '自定义', value: 'custom' },
]

const { data: dictOpts } = useRequest(getSimpleDictTypeList, { immediate: true })

const saveFormatterConfig = () => {
  const activedColumn = props.value.columns?.find((c) => c.key === activeColumn.value?.key)
  if (activedColumn) {
    activedColumn.formatter = formatter.value
  }

  visible.value = false
}

defineExpose({ open })
</script>

<template>
  <TDialog v-model:visible="visible" header="列渲染格式配置" @confirm="saveFormatterConfig">
    <TForm ref="formRef" :data="formatter">
      <TFormItem label="列渲染格式">
        <TSelect v-model:value="formatter.type" :options="formatterOpts" />
      </TFormItem>
    </TForm>
    <TFormItem v-if="formatter.type === 'dict'">
      <TSelect v-model:value="formatter.value" :options="dictOpts" filterable />
    </TFormItem>
    <TFormItem v-if="formatter.type === 'custom'">
      <CodeEditor v-model="formatter.value" :height="200" />
    </TFormItem>
  </TDialog>
</template>
