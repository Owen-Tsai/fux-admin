import type { TableProps, FormInstanceFunctions } from 'tdesign-vue-next'
import {
  getCodeGenConfigList,
  deleteCodeGenConfig,
  syncTable,
  downloadCode,
  downloadCodeBatch,
  type ListQueryParams,
} from '@/api/infra/code-gen'

export const columns: TableProps['columns'] = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 50,
  },
  { colKey: 'dataSourceConfigId', title: '数据源', width: 90 },
  { colKey: 'tableName', title: '表名称' },
  { colKey: 'tableComment', title: '表描述' },
  { colKey: 'className', title: '实体' },
  {
    colKey: 'createTime',
    title: '创建时间',
    minWidth: 140,
  },
  {
    colKey: 'updateTime',
    title: '更新时间',
    minWidth: 140,
  },
  { colKey: 'actions', title: '操作', width: 140 },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const message = useMessage()
  const dialog = useDialog()
  const { push } = useRouter()

  const query = ref<ListQueryParams>({
    pageNo: 1,
    pageSize: 10,
    createTime: [],
  })

  const { data, pending, execute } = useRequest(() => getCodeGenConfigList(query.value), {
    immediate: true,
  })

  const pagination = computed<TableProps['pagination']>(() => ({
    pageSize: query.value.pageSize,
    current: query.value.pageNo,
    total: data.value?.total,
  }))

  const onPageChange: TableProps['onPageChange'] = ({ current, pageSize }) => {
    query.value.pageNo = current
    query.value.pageSize = pageSize

    execute()
  }

  const onQueryChange = (reset?: boolean) => {
    query.value.pageNo = 1
    if (reset) {
      formRef.value?.reset()
    }
    execute()
  }

  const onDelete = (id: number) => {
    const instance = dialog.confirm({
      header: '删除代码生成配置',
      body: '确定要删除吗？该操作无法恢复',
      onConfirm: async () => {
        await deleteCodeGenConfig(id)
        message.success('删除成功')
        execute()
        instance.destroy()
      },
    })
  }

  const onEdit = (id?: number) => {
    push(`/infra/code-gen/edit?id=${id}`)
  }

  const onSyncFromDb = (id: number) => {
    const instance = dialog.confirm({
      header: '同步确认',
      body: '确定要同步数据库结构吗？',
      onConfirm: async () => {
        await syncTable(id)
        message.success('同步成功')
        execute()
        instance.destroy()
      },
    })
  }


  const onDownload = (id: number) => {
    downloadCode(id)
  }


  const selectedRowKeys = ref<(number | string)[]>([])

  const onBatchDownload = async () => {
    downloadCodeBatch(selectedRowKeys.value)
  }
  const rehandleSelectChange: TableProps['onSelectChange'] = (value) => {
    selectedRowKeys.value = value;
  };

  return {
    query,
    execute,
    data,
    pending,
    pagination,
    onPageChange,
    onQueryChange,
    onDelete,
    onEdit,
    onSyncFromDb,
    onDownload,
    onBatchDownload,
    selectedRowKeys,
    rehandleSelectChange
  }
}
