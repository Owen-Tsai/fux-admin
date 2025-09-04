import { getList, deleteIPRule, type ListQueryParams } from '@/api/system/ip'
import type { TableProps, FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { colKey: 'ipAddress', title: '异常IP地址', width: 140 },
  { colKey: 'abnormalType', title: '异常类型', width: 100 },
  { colKey: 'accessTime', title: '访问时间', width: 140 },
  { colKey: 'accessResource', title: '访问资源', ellipsis: true },
  { colKey: 'handlingStatus', title: '处理状态', width: 140 },
  { colKey: 'actions', title: '操作', fixed: 'right', width: 100 },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<ListQueryParams>({
    pageNo: 1,
    pageSize: 10,
    accessTime: [],
  })

  const { data, pending, execute } = useRequest(() => getList(query.value), {
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

  return {
    query,
    execute,
    data,
    pending,
    pagination,
    onPageChange,
    onQueryChange,
  }
}
