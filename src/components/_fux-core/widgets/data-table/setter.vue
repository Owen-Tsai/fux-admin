<template>
  <TFormItem label="URL" help="如: /applications/pension">
    <TInput v-model:value="props.url" />
  </TFormItem>
  <TFormItem label="切换配置模式">
    <TRadioGroup v-model:value="props.state.mode" theme="button" :options="modeOpts" />
  </TFormItem>
  <template v-if="props.state.mode === 'table'">
    <TFormItem label="列配置">
      <TButton theme="default" block @click="onEditColumns">编辑列</TButton>
    </TFormItem>
    <TFormItem label="禁用分页" class="boolean-setter">
      <TSwitch v-model:value="props.pagination.disabled" />
    </TFormItem>
    <template v-if="!props.pagination.disabled">
      <TFormItem label="每页条数">
        <TInputNumber
          v-model:value="props.pagination.pageSize"
          :min="1"
          :step="1"
          :decimal-places="0"
        />
      </TFormItem>
      <TFormItem label="精简模式" class="boolean-setter">
        <TSwitch v-model:value="props.pagination.lite" />
      </TFormItem>
      <TFormItem label="小尺寸" class="boolean-setter">
        <TSwitch v-model:value="props.pagination.small" />
      </TFormItem>
    </template>
  </template>
  <template v-if="props.state.mode === 'form'">
    <TFormItem label="弹窗宽度" help="请输入含单位的值 (px/%)">
      <TInput v-model:value="props.dialogWidth" />
    </TFormItem>
    <TFormItem label="字段标签位置">
      <TSelect v-model:value="props.form.labelAlign" :options="labelAlignOpts" />
    </TFormItem>
    <TFormItem label="标签列宽度" help="输入含单位的值(px/%/rem/...)">
      <TInput v-model:value="props.form.labelWidth" />
    </TFormItem>
    <TFormItem label="必填标记">
      <TSelect v-model:value="props.form.requiredMark" :options="requiredMarkOpts" />
    </TFormItem>
    <TFormItem label="显示标签后的冒号" class="boolean-setter">
      <TSwitch v-model:value="props.form.colon" />
    </TFormItem>
  </template>
  <TableColumnSetter ref="columnSetterRef" v-model:props="props" />
</template>

<script setup lang="ts">
import { labelAlignOpts, requiredMarkOpts } from '@fusionx/core/utils/form-setter-opts'
import TableColumnSetter from './table-column-setter.vue'
import type { WidgetMap } from '@fusionx/core/types'

const props = defineModel<WidgetMap['dataTable']['props']>('props', { required: true })

const columnSetterRef = useTemplateRef<InstanceType<typeof TableColumnSetter>>('columnSetterRef')

const modeOpts = [
  { label: '配置表格', value: 'table' },
  { label: '配置表单', value: 'form' },
]

const onEditColumns = () => {
  columnSetterRef.value?.open()
}
</script>
