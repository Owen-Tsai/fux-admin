import { getErrorLogPage, setProcessStatus, type ListQueryParams } from '@/api/system/log/error-log'
import type { ERROR_LOG_PROCESS_STATUS } from '@/utils/constant'
import type { TableProps, FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { colKey: 'id', title: '日志编号', width: 90, ellipsis: true },
  { colKey: 'applicationName', title: '应用名', width: 120, ellipsis: true },
  { colKey: 'requestMethod', title: '请求方法', width: 90 },
  { colKey: 'requestUrl', title: '请求地址', ellipsis: true },
  { colKey: 'exceptionName', title: '异常名' },
  { colKey: 'exceptionTime', title: '异常时间', width: 180 },
  { colKey: 'processStatus', title: '处理状态', width: 120 },
  { colKey: 'actions', title: '详情', width: 90 },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<ListQueryParams>({
    pageNo: 1,
    pageSize: 10,
    exceptionTime: [],
  })

  const message = useMessage()

  const { data, pending, execute } = useRequest(() => getErrorLogPage(query.value), {
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

  const onUpdateStatus = async (id: number, status: ERROR_LOG_PROCESS_STATUS) => {
    pending.value = true
    await setProcessStatus(id, status)
    message.success('操作成功')
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
    onUpdateStatus,
  }
}
