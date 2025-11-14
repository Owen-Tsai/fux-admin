import { getOperateLogPage, type ListQueryParams } from '@/api/system/log/op-log'
import type { TableProps, FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { colKey: 'id', title: '日志编号', width: 90 },
  { colKey: 'module', title: '操作模块', ellipsis: true },
  { colKey: 'name', title: '操作名', minWidth: 140 },
  { colKey: 'type', title: '操作类型', width: 90 },
  { colKey: 'userNickname', title: '操作人', ellipsis: true, width: 90 },
  { colKey: 'resultCode', title: '操作结果', width: 90 },
  { colKey: 'startTime', title: '操作时间', width: 120 },
  { colKey: 'duration', title: '执行时长', width: 90 },
  { colKey: 'actions', title: '操作', width: 90 },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<ListQueryParams>({
    pageNo: 1,
    pageSize: 10,
    startTime: [],
  })

  const { data, pending, execute } = useRequest(() => getOperateLogPage(query.value), {
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
    data,
    pending,
    execute,
    query,
    onQueryChange,
    pagination,
    onPageChange,
  }
}
