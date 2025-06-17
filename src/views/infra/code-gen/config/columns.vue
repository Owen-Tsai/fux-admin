<template>
  <TTable
    :columns="columns"
    :data="model"
    :loading="pending"
    :header-affixed-top="tableAffixProps"
    horizontal-scroll-affixed-bottom
    class="!mt-4"
  >
    <template #columnComment="{ row }: TableScope<ColumnVO>">
      <TInput v-model:value="row.columnComment" placeholder="如：姓名" />
    </template>
    <template #javaType="{ row }: TableScope<ColumnVO>">
      <TSelect
        v-model:value="row.javaType"
        :options="javaTypeOpts"
        placeholder="请选择..."
        class="w-full"
      />
    </template>
    <template #javaField="{ row }: TableScope<ColumnVO>">
      <TInput v-model:value="row.javaField" placeholder="如：name" />
    </template>
    <template #createOperation="{ row }: TableScope<ColumnVO>">
      <TCheckbox v-model:checked="row.createOperation" />
    </template>
    <template #updateOperation="{ row }: TableScope<ColumnVO>">
      <TCheckbox v-model:checked="row.updateOperation" />
    </template>
    <template #listOperation="{ row }: TableScope<ColumnVO>">
      <TCheckbox v-model:checked="row.listOperation" />
    </template>
    <template #listOperationResult="{ row }: TableScope<ColumnVO>">
      <TCheckbox v-model:checked="row.listOperationResult" />
    </template>
    <template #listOperationCondition="{ row }: TableScope<ColumnVO>">
      <TSelect v-model:value="row.listOperationCondition" :options="listOperationConditionOpts" />
    </template>
    <template #nullable="{ row }: TableScope<ColumnVO>">
      <TCheckbox v-model:checked="row.nullable" />
    </template>
    <template #htmlType="{ row }: TableScope<ColumnVO>">
      <TSelect v-model:value="row.htmlType" :options="htmlTypeOpts" />
    </template>
    <template #dictType="{ row }: TableScope<ColumnVO>">
      <TSelect
        v-model:value="row.dictType"
        :options="dictTypes"
        :keys="{ label: 'name', value: 'type' }"
        placeholder="请选择..."
        class="w-full"
      />
    </template>
    <template #example="{ row }: TableScope<ColumnVO>">
      <TInput v-model:value="row.example" placeholder="如：张三" />
    </template>
  </TTable>
</template>

<script setup lang="ts">
import { getPlainDictTypeList } from '@/api/system/dict/type'
import type { ColumnVO, ConfigDetailVO } from '@/api/infra/code-gen'
import type { TableProps } from 'tdesign-vue-next'

const columns: TableProps['columns'] = [
  { title: '字段名称', colKey: 'columnName', fixed: 'left' },
  { title: '字段描述', colKey: 'columnComment', width: 160 },
  { title: '存储类型', colKey: 'dataType', minWidth: 120 },
  { title: 'java 类型', colKey: 'javaType', width: 160 },
  { title: 'java 类属性', colKey: 'javaField', minWidth: 160 },
  { title: '插入', colKey: 'createOperation', width: 46 },
  { title: '编辑', colKey: 'updateOperation', width: 46 },
  { title: '列表', colKey: 'listOperation', width: 46 },
  { title: '查询', colKey: 'listOperationResult', width: 46 },
  { title: '查询方式', colKey: 'listOperationCondition' },
  { title: '允许空', colKey: 'nullable', width: 80 },
  { title: '显示组件', colKey: 'htmlType', width: 160 },
  { title: '引用字典', colKey: 'dictType', width: 160 },
  { title: '示例', colKey: 'example' },
]

const javaTypeOpts = [
  { value: 'Long' },
  { value: 'String' },
  { value: 'Integer' },
  { value: 'Douoble' },
  { value: 'BigDecimal' },
  { value: 'LocalDateTime' },
  { value: 'Boolean' },
]

const listOperationConditionOpts = [
  { value: '=' },
  { value: '!=' },
  { value: '>' },
  { value: '>=' },
  { value: '<' },
  { value: '<=' },
  { value: 'LIKE' },
  { value: 'BETWEEN' },
]

const htmlTypeOpts = [
  { label: '文本框', value: 'input' },
  { label: '数字输入框', value: 'number' },
  { label: '下拉选择框', value: 'select' },
  { label: '单选框', value: 'radio' },
  { label: '复选框', value: 'checkbox' },
  { label: '日期选择框', value: 'datetime' },
  { label: '图片上传', value: 'imageUpload' },
  { label: '文件上传', value: 'fileUpload' },
  { label: '富文本编辑器', value: 'editor' },
]

const model = defineModel<ConfigDetailVO['columns']>({ required: true })

const { data: dictTypes, pending } = useRequest(getPlainDictTypeList, { immediate: true })

const tableAffixProps = computed<TableProps['headerAffixedTop']>(() => ({
  container: '#fux-app-scroll-container',
}))
</script>
