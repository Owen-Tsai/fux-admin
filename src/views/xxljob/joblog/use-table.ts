import { getXxlJobLogList,deleteXxlJobLog, type ListQueryParams } from '@/api/xxljob/joblog'
import type { TableProps,FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { colKey: 'jobId', title: '任务ID', width: 120 },
  { colKey: 'executorHandler', title: 'Jobhandler', width: 200 },
  { colKey: 'triggerTime', title: '调度时间', width:150 },
  { colKey: 'triggerCode', title: '调度结果', width: 100 },
  { colKey: 'triggerMsg', title: '调度备注', width: 100 },
  { colKey: 'handleTime', title: '执行时间', width: 150 },
  { colKey: 'handleCode', title: '执行结果', width: 90 },
  // { colKey: 'jobGroup', title: '执行器ID' },
  // { colKey: 'executorAddress', title: '执行器地址' },
  { colKey: 'handleMsg', title: '执行备注', width: 90 },
  // { colKey: 'alarmStatus', title: '告警状态' },
  { colKey: 'actions', title: '操作', width: 80, fixed: "right" }
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<ListQueryParams>({
    jobGroup: undefined,
    pageNo: 1,
    pageSize: 10,
    timeScope: []
  })

  const { data, pending, execute } = useRequest(() => getXxlJobLogList(query.value), {
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
    await deleteXxlJobLog(id)
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
