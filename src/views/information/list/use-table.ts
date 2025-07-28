import { getInfoList, deleteInfo, type ListQueryParams } from '@/api/information/list'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { title: '资讯标题', colKey: 'title' },
  { title: '资讯类别', colKey: 'type', width: 120 },
  { title: '创建人', colKey: 'creator', width: 120, ellipsis: true },
  { title: '状态', width: 120, colKey: 'auditState' },
  {
    title: '创建时间',
    width: 180,
    colKey: 'createTime',
  },
  {
    title: '更新时间',
    width: 180,
    colKey: 'updateTime',
  },
  { title: '操作', width: 100, colKey: 'actions' },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<ListQueryParams>({
    createTime: [],
    publishTime: [],
    pageNo: 1,
    pageSize: 10,
  })

  const message = useMessage()

  const { data, execute, pending } = useRequest(() => getInfoList(query.value), {
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
    await deleteInfo(id)
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
