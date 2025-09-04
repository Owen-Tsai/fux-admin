import { getPolicyList, deletePolicy, type ListQueryParams } from '@/api/system/policy/list'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { title: '政策编号', colKey: 'id', width: 180 },
  { title: '政策标题', colKey: 'title' },
  { title: '成文日期', colKey: 'sendDate', width: 120 },
  {
    title: '创建时间',
    width: 180,
    colKey: 'createTime',
  },
  {
    title: '排序',
    width: 70,
    colKey: 'sort',
  },
  { title: '操作', width: 100, colKey: 'actions' },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<ListQueryParams>({
    createTime: [],
    pageNo: 1,
    pageSize: 10,
  })

  const message = useMessage()

  const { data, execute, pending } = useRequest(() => getPolicyList(query.value), {
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
    pending.value = true
    await deletePolicy(id)
    message.success('删除成功')
    execute()
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
  }
}
