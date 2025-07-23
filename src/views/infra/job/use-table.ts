import useRequest from '@/hooks/use-request'
import {
  getJobList,
  deleteJob,
  updateJobStatus,
  runJob,
  type ListQueryParams,
  type JobVO,
} from '@/api/infra/job'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'

export enum JOB_STATUS {
  INIT = 0,
  NORMAL = 1,
  STOP = 2,
}

export const columns: TableProps['columns'] = [
  { title: '任务名称', colKey: 'name', ellipsis: true },
  { title: '任务状态', colKey: 'status', width: 120 },
  { title: '处理器名称', colKey: 'handlerName', ellipsis: true },
  { title: '处理器参数', colKey: 'handlerParam', ellipsis: true },
  { title: 'CRON表达式', colKey: 'cronExpression', ellipsis: true },
  { title: '操作', width: 180, colKey: 'actions' },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const dialog = useDialog()
  const message = useMessage()

  const query = ref<ListQueryParams>({
    pageNo: 1,
    pageSize: 10,
  })

  const { data, execute, pending } = useRequest(() => getJobList(query.value), {
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
    const instance = dialog.confirm({
      header: '删除定时任务',
      body: '确定要删除吗？该操作无法恢复',
      onConfirm: async () => {
        pending.value = true
        await deleteJob(id)
        execute()
        message.success('删除成功')
        instance.destroy()
      },
    })
  }

  const onUpdateStatus = async (record: JobVO) => {
    pending.value = true
    const newStatus = record.status === JOB_STATUS.NORMAL ? JOB_STATUS.STOP : JOB_STATUS.NORMAL
    await updateJobStatus(record.id!, newStatus)
    message.success('更新成功')
    execute()
  }

  const onRun = async (record: JobVO) => {
    const instance = dialog.confirm({
      header: '运行定时任务',
      body: `确定要运行任务 ${record.name} 吗？`,
      onConfirm: async () => {
        await runJob(record.id!)
        message.success('运行成功')
        instance.destroy()
      },
    })
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
    onUpdateStatus,
    onRun,
  }
}
