import useRequest from '@/hooks/use-request'
import { getDataSourceList, deleteDataSource } from '@/api/infra/data-source'
import type { TableProps } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { title: '数据源名称', colKey: 'name', width: 160, ellipsis: true },
  { title: '数据源连接', colKey: 'url' },
  { title: '用户名', colKey: 'username', width: 160, ellipsis: true },
  {
    title: '创建时间',
    width: 180,
    colKey: 'createTime',
  },
  { title: '操作', width: 140, colKey: 'actions' },
]

export const useTable = () => {
  const { data, execute, pending } = useRequest(getDataSourceList, {
    immediate: true,
  })

  const pagination = computed<TableProps['pagination']>(() => ({}))

  const onDelete = async (id: number) => {
    await deleteDataSource(id)
    execute()
  }

  return {
    data,
    pending,
    pagination,
    onDelete,
    execute,
  }
}
