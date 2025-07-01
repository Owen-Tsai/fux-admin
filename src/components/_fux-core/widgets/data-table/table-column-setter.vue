<script setup lang="ts">
import ColumnFormatSetter from './column-format-setter.vue'
import type { WidgetMap } from '@fusionx/core/types'
import type { WPropsTableColumn } from '../../types/form/layout-widgets'

const props = defineModel<WidgetMap['dataTable']['props']>('props', { required: true })

const formatSetterRef = useTemplateRef<InstanceType<typeof ColumnFormatSetter>>('formatSetterRef')

const visible = ref(false)

const open = () => {
  visible.value = true
}

const columns = ref<Array<WPropsTableColumn & { idx?: number }>>([])

const alignOpts = [
  { label: '左对齐', value: 'left' },
  { label: '右对齐', value: 'right' },
  { label: '居中对齐', value: 'center' },
]

const saveColumnsConfig = () => {}

const openColumnFormatSetter = (column: WPropsTableColumn) => {
  formatSetterRef.value?.open(column)
}

defineExpose({ open })
</script>

<template>
  <TDialog v-model:visible="visible" header="列配置" width="1000px" @confirm="saveColumnsConfig">
    <TForm :data="columns">
      <div ref="dragWrapper">
        <div v-for="(column, idx) in columns" :key="idx" class="flex items-center gap-4 mb-4">
          <div class="drag-handle cursor-move">
            <TIcon name="view-list" />
          </div>
          <AFormItem label="列标题" :name="['columns', idx, 'title']">
            <TInput v-model:value="column.title" />
          </AFormItem>
          <AFormItem label="键名" :name="['columns', idx, 'key']">
            <TInput v-model:value="column.key" />
          </AFormItem>
          <AFormItem label="列宽度" :name="['columns', idx, 'width']">
            <TInput v-model:value="column.width" placeholder="请输入含单位的值" />
          </AFormItem>
          <AFormItem label="列对齐方式" :name="['columns', idx, 'align']">
            <TSelect v-model:value="column.align" :options="alignOpts" />
          </AFormItem>
          <TTooltip content="配置列渲染格式">
            <TButton shape="square" theme="default" @click="openColumnFormatSetter(column)">
              <template #icon><TIcon name="code-1" /></template>
            </TButton>
          </TTooltip>
          <TTooltip content="删除列">
            <TButton shape="square" theme="default">
              <template #icon><TIcon name="delete" /></template>
            </TButton>
          </TTooltip>
        </div>
      </div>

      <TButton variant="outline" block>
        <template #icon><TIcon name="add" /></template>
        添加列
      </TButton>
    </TForm>
  </TDialog>

  <ColumnFormatSetter ref="formatSetterRef" v-model:props="props" />
</template>
