import {
  deleteJobInfo,
  getJobInfoList,
  triggerJob,
  type ListQueryParams,
  type JobInfoVO,
  type JobTriggerParams
} from '@/api/xxljob/jobinfo'
import type { FormInstanceFunctions, TableProps, DropdownOption } from 'tdesign-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { colKey: 'id', title: 'ID', width: 80 },
  // { colKey: 'jobGroup', title: '执行器主键ID' },
  { colKey: 'jobDesc', title: '任务描述' },
  { colKey: 'scheduleType', title: '调度类型' },
  // { colKey: 'scheduleConf', title: '调度配置，值含义取决于调度类型' },
  { colKey: 'executorHandler', title: '运行模式' },
  { colKey: 'triggerStatus', title: '调度状态', align: "center", width: 120 },
  { colKey: 'actions', title: '操作', align: "center", width: 120 },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<ListQueryParams>({
    id: undefined,
    jobGroup: undefined,
    jobDesc: '',
    scheduleType: '',
    scheduleConf: '',
    executorHandler: '',
    triggerStatus: undefined,
    pageNo: 1,
    pageSize: 10,
  })

  const { data, pending, execute } = useRequest(() => getJobInfoList(query.value), {
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
    await deleteJobInfo(id)
    execute()
  }

  const onOperationClickHandler = async (data: DropdownOption) => {
    // await deleteJobInfo(id)
    console.log(data)
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
    onDelete
  }
}
