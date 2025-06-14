import { getLoginLogPage, type ListQueryParams } from '@/api/system/log/login-log'
import type { TableProps, FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { colKey: 'id', title: '日志编号', width: 120 },
  { colKey: 'logType', title: '操作类型', width: 120 },
  { colKey: 'username', title: '用户账号' },
  { colKey: 'userIp', title: '登录地址', width: 140 },
  { colKey: 'result', title: '登录结果', width: 120 },
  { colKey: 'createTime', title: '操作时间', width: 180 },
  { colKey: 'actions', title: '操作', width: 120 },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<ListQueryParams>({
    pageNo: 1,
    pageSize: 10,
    createTime: [],
  })

  const { data, pending, execute } = useRequest(() => getLoginLogPage(query.value), {
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
