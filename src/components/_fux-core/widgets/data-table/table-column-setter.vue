<script setup lang="ts">
import ColumnFormatSetter from './column-format-setter.vue'
import type { WidgetMap } from '@fusionx/core/types'
import type { WPropsTableColumn } from '../../types/form/layout-widgets'
import { useSortable } from '@vueuse/integrations/useSortable.mjs'

const props = defineModel<WidgetMap['dataTable']['props']>('props', { required: true })

const formatSetterRef = useTemplateRef<InstanceType<typeof ColumnFormatSetter>>('formatSetterRef')

const visible = ref(false)
const dragWrapper = useTemplateRef('dragWrapper')

const open = () => {
  visible.value = true
  if (props.value.columns) {
    columns.value = [...props.value.columns]
  } else {
    columns.value = []
  }
}

const columns = ref<Array<WPropsTableColumn & { idx?: number }>>([])

useSortable(dragWrapper, columns, {
  animation: 200,
  handle: '.drag-handle',
})

const alignOpts = [
  { label: '左对齐', value: 'left' },
  { label: '右对齐', value: 'right' },
  { label: '居中对齐', value: 'center' },
]

const saveColumnsConfig = () => {
  props.value.columns = columns.value
  visible.value = false
}

const addColumn = () => {
  columns.value.push({
    title: '',
    colKey: '',
    width: '',
    formatter: {
      type: '',
      value: '',
    },
  })
}

const deleteColumn = (idx: number) => {
  columns.value.splice(idx, 1)
}

const openColumnFormatSetter = (column: WPropsTableColumn) => {
  formatSetterRef.value?.open(column)
}

defineExpose({ open })
</script>

<template>
  <TDialog v-model:visible="visible" header="列配置" width="1200px" @confirm="saveColumnsConfig">
    <TForm :data="columns" label-width="80px" layout="inline" label-align="right">
      <div ref="dragWrapper">
        <div v-for="(column, idx) in columns" :key="idx" class="flex items-center gap-2 mb-2">
          <div class="drag-handle cursor-move">
            <Icon name="view-list" />
          </div>
          <TFormItem label="列标题" :name="`columns[${idx}].title`">
            <TInput v-model:value="column.title" />
          </TFormItem>
          <TFormItem label="键名" :name="`columns[${idx}].colKey`">
            <TInput v-model:value="column.colKey" />
          </TFormItem>
          <TFormItem label="列宽度" :name="`columns[${idx}].width`">
            <TInput v-model:value="column.width" placeholder="请输入含单位的值" />
          </TFormItem>
          <TFormItem label="列对齐方式" :name="`columns[${idx}].align`">
            <TSelect v-model:value="column.align" :options="alignOpts" />
          </TFormItem>
          <div class="flex-none flex items-center gap-1">
            <TTooltip content="配置列渲染格式">
              <TButton
                shape="square"
                theme="default"
                class="flex-none"
                @click="openColumnFormatSetter(column)"
              >
                <template #icon><Icon name="code" /></template>
              </TButton>
            </TTooltip>
            <TTooltip content="删除列">
              <TButton shape="square" theme="default" class="flex-none" @click="deleteColumn(idx)">
                <template #icon><Icon name="delete" /></template>
              </TButton>
            </TTooltip>
          </div>
        </div>
      </div>

      <TButton variant="outline" block @click="addColumn">
        <template #icon><Icon name="add" /></template>
        添加列
      </TButton>
    </TForm>
  </TDialog>

  <ColumnFormatSetter ref="formatSetterRef" v-model:props="props" />
</template>
