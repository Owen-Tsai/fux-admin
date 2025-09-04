import useRequest from '@/hooks/use-request'
import { getFileList, deleteFile, type ListQueryParams } from '@/api/infra/file'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { title: '文件ID', colKey: 'id', width: 60, ellipsis: true },
  { title: '文件名', colKey: 'name', width: 120, ellipsis: true },
  { title: '文件路径', colKey: 'path', width: 120, ellipsis: true },
  { title: '文件类型', colKey: 'type', width: 100, ellipsis: true },
  { title: '预览', colKey: 'preview', width: 120 },
  {
    title: '创建时间',
    width: 180,
    colKey: 'createTime',
  },
  { title: '操作', width: 80, colKey: 'actions' },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const message = useMessage()

  const query = ref<ListQueryParams>({
    pageNo: 1,
    pageSize: 10,
  })

  const { data, execute, pending } = useRequest(() => getFileList(query.value), {
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

  const onDelete = async (id: number) => {
    pending.value = true
    await deleteFile(id)
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
