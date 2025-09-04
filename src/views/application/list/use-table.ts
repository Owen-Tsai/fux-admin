import useRequest from '@/hooks/use-request'
import {
  getApplicationList,
  deleteApplication,
  setPublished,
  type ListQueryParams,
} from '@/api/app/app'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { title: '应用名称', colKey: 'name', width: 160, ellipsis: true },
  { title: '应用类别', colKey: 'type', width: 160, ellipsis: true },
  { title: '应用描述', colKey: 'description', ellipsis: true },
  { title: '状态', width: 120, colKey: 'published' },
  {
    title: '创建时间',
    minWidth: 100,
    colKey: 'createTime',
  },
  {
    title: '更新时间',
    minWidth: 100,
    colKey: 'updateTime',
  },
  { title: '操作', width: 100, colKey: 'actions' },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<ListQueryParams>({
    createTime: [],
    updateTime: [],
    pageNo: 1,
    pageSize: 10,
  })

  const dialog = useDialog()

  const { data, execute, pending } = useRequest(() => getApplicationList(query.value), {
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

  const onDelete = async (id: string) => {
    const instance = dialog.confirm({
      header: '删除应用',
      body: '确认删除应用吗？该操作无法恢复，如需暂时停用应用可以使用【下架】功能。',
      async onConfirm() {
        await deleteApplication(id)
        instance.destroy()
        execute()
      },
    })
  }

  const onSetPublished = async (id: string, published: boolean) => {
    pending.value = true
    await setPublished(id, published)
    execute()
    pending.value = false
  }

  return {
    data,
    pending,
    query,
    pagination,
    onPageChange,
    onQueryChange,
    execute,
    onDelete,
    onSetPublished,
  }
}
