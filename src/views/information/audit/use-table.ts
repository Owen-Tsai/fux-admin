import useRequest from '@/hooks/use-request'
import {
  getInfoAuditList,
  updateInfoAuditState,
  type ListQueryParams,
} from '@/api/information/audit'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { colKey: 'title', title: '资讯标题', ellipsis: true },
  { colKey: 'infoType', title: '资讯类型' },
  { colKey: 'creator', title: '创建人' },
  { colKey: 'createTime', title: '创建时间', width: 200 },
  { colKey: 'auditState', title: '审核状态', width: 140 },
  { colKey: 'actions', title: '操作', width: 180 },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const message = useMessage()

  const query = ref<ListQueryParams>({
    createTime: [],
    pageNo: 1,
    pageSize: 10,
  })

  const { data, pending, execute } = useRequest(() => getInfoAuditList(query.value), {
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

  const onAudit = async (id: string, auditState: number, review?: string) => {
    pending.value = true
    await updateInfoAuditState({
      id,
      auditState,
      review,
    })
    message.success('审核成功')
    execute()
  }

  return {
    data,
    pending,
    execute,
    pagination,
    query,
    onPageChange,
    onQueryChange,
    onAudit,
  }
}
