import { getList, deleteIPListEntry, type ListQueryParams } from '@/api/system/ip/list'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { title: 'IP 地址', colKey: 'ipAddress' },
  { title: 'IP 类型', colKey: 'listType', width: 140 },
  { title: '描述', width: 200, colKey: 'description', ellipsis: true },
  {
    title: '创建时间',
    minWidth: 180,
    colKey: 'createTime',
  },
  { title: '操作', width: 100, colKey: 'actions' },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const route = useRoute()
  const { path } = route
  const isWhitelist = path.includes('white-list')

  const query = ref<ListQueryParams>({
    createTime: [],
    pageNo: 1,
    pageSize: 10,
    listType: isWhitelist,
  })

  const { data, execute, pending } = useRequest(() => getList({ ...query.value }), {
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
    await deleteIPListEntry(id)
    execute()
  }

  return {
    data,
    pending,
    query,
    pagination,
    isWhitelist,
    onPageChange,
    onQueryChange,
    execute,
    onDelete,
  }
}
