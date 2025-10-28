import useRequest from '@/hooks/use-request'
import { getAuditList, type ListQueryParams, type AuditEntryVO } from '@/api/business'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { title: '申请人', colKey: 'startUser', width: 160, ellipsis: true },
  { title: '创建时间', colKey: 'createTime', ellipsis: true },
  { title: '提交时间', colKey: 'submitTime', ellipsis: true },
  { title: '审核状态', colKey: 'auditProcess', width: 120, ellipsis: true },
  { title: '任务名称', colKey: 'taskName', ellipsis: true },
  { title: '操作', width: 120, colKey: 'actions' },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const route = useRoute()
  const { push } = useRouter()
  const appId = route.params.appId as string
  const taskKey = route.query.taskDefKey as string

  const query = ref<ListQueryParams>({
    taskKey,
    appId,
    submitTime: [],
    createTime: [],
    pageNo: 1,
    pageSize: 10,
  })

  const { data, execute, pending } = useRequest(() => getAuditList(query.value), {
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

  const toAuditPage = (row: AuditEntryVO) => {
    push(
      `/business/${appId}/audit/detail?applyId=${row.comApplyId}&taskId=${row.taskId}&processInstanceId=${row.processInstanceId}&taskKey=${taskKey}`,
    )
  }

  return {
    data,
    pending,
    query,
    pagination,
    onPageChange,
    onQueryChange,
    execute,
    toAuditPage,
  }
}
