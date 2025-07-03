<template>
  <div>
    <div class="flex items-center gap-2">
      <TButton @click="tableDialogRef?.onAdd()">
        <template #icon>
          <TIcon name="plus" />
          增加
        </template>
      </TButton>
    </div>
    <TTable
      v-show="!isProd && widget.props.state.mode === 'table'"
      :columns="widget.props.columns"
      :pagination="pagination"
      :data="states.data"
      row-key="id"
      class="!mt-4"
      @page-change="onPageChange"
    >
      <template v-for="(column, i) in widget.props.columns" :key="i" #[column.key]="{ row }">
        <template v-if="column.formatter?.type === 'dict'">
          <DictTag :dict-data="getDictData(column.formatter.value)" :value="row[column.key]" />
        </template>
        <template v-else-if="column.formatter?.type === 'image'">
          <TImageViewer v-model:visible="imageViewerVisible" :src="row[column.key]" />
        </template>
        <template v-else-if="column.formatter?.type === 'custom'">
          {{ renderColumn(column.formatter.value, row) }}
        </template>
        <template v-else-if="column.key === 'actions'">
          <div class="flex gap-2">
            <TTooltip content="编辑">
              <TButton
                shape="square"
                theme="primary"
                variant="text"
                @click="tableDialogRef?.onEdit(row.id)"
              >
                <template #icon>
                  <TIcon name="edit-2" />
                </template>
              </TButton>
            </TTooltip>
            <TTooltip content="删除">
              <TPopconfirm
                content="确定删除吗？该操作无法撤销"
                theme="danger"
                @confirm="onDelete(row.id!)"
              >
                <TButton shape="square" theme="danger" variant="text">
                  <template #icon>
                    <TIcon name="delete" />
                  </template>
                </TButton>
              </TPopconfirm>
            </TTooltip>
          </div>
        </template>
      </template>
    </TTable>

    <div v-if="!isProd && widget.props.state.mode === 'form'">
      <div
        class="draggable-area mt-4 p-1"
        :class="{ 'empty-slot': widget.props.widgets.length <= 0 }"
      >
        <NestedWidgets :widgets="widget.props.widgets" />
      </div>
    </div>

    <TableDialog ref="tableDialogRef" :widget="widget" :fetch-table-data="loadData" />
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { safeEval } from '@fusionx/core/utils'
import { useRendererCtxInject } from '@fusionx/core/hooks'
import request from '@/utils/request'
import TableDialog from './table-dialog.vue'
import NestedWidgets from '@fusionx/core/form-designer/canvas/nested.vue'
import type { TableProps } from 'tdesign-vue-next'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['dataTable']
}>()

const URL_PREFIX = widget.props.url || ''

const states = ref<{
  total: number
  data: any[]
  current: number
}>({
  total: 0,
  data: [],
  current: 1,
})

const rendererCtx = useRendererCtxInject()

const isProd = computed(() => rendererCtx && rendererCtx.mode !== 'dev')

const loading = ref(false)

const pagination = computed<TableProps['pagination']>(() => ({
  current: states.value.current,
  total: states.value.total,
}))

const dictTypes = ref(
  widget.props.columns?.filter((c) => c.formatter?.type === 'dict').map((c) => c.formatter?.value),
)

const dict = useDict(...(dictTypes.value || []))

const getDictData = (dictType: string) => {
  const idx = dictTypes.value?.indexOf(dictType)
  return idx !== undefined && idx > -1 ? dict[idx].value : []
}

const loadData = async () => {
  if (
    rendererCtx?.mode === 'prod' ||
    rendererCtx?.mode === 'audit' ||
    rendererCtx?.mode === 'archive'
  ) {
    // 仅在申报、审核、信息库模式下载入数据
    loading.value = true
    const url = `${URL_PREFIX}/page`
    const res = await request.get({
      url,
      params: {
        pageNo: states.value.current,
        // TODO: delareId: appParamsCtx.applyId
      },
    })

    states.value.data = res.list
    states.value.total = res.total
    loading.value = false
  }
}

// column rendering
const imageViewerVisible = ref(false)

const renderColumn = (expression: string, record: any) => {
  return safeEval(expression, {
    ...record,
    Date: Date,
    dayjs: dayjs,
    $state: rendererCtx?.$state || {},
  })
}

// form dialog
const tableDialogRef = useTemplateRef<InstanceType<typeof TableDialog>>('tableDialogRef')

const onDelete = async (id: string) => {
  loading.value = true
  try {
    await request.delete({
      url: `${URL_PREFIX}/delete?id=${id}`,
    })
  } finally {
    loading.value = false
  }
}

// setup
loadData()

const onPageChange = () => {
  loadData()
}
</script>
