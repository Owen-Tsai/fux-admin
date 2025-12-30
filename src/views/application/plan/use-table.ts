import useRequest from '@/hooks/use-request'
import { getPlanList, deletePlan, type ListQueryParams } from '@/api/app/plan'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { title: '计划名称', colKey: 'item', ellipsis: true },
  { title: '关联应用', colKey: 'appId', ellipsis: true },
  {
    title: '开始时间',
    width: 180,
    colKey: 'startTime',
  },
  {
    title: '截止时间',
    width: 170,
    colKey: 'endTime',
  },
  { title: '操作', width: 140, colKey: 'actions' },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const route = useRoute()

  const query = ref<ListQueryParams>({
    createTime: [],
    endTime: [],
    pageNo: 1,
    pageSize: 10,
    appId: (route.params?.appId as string) || (route.query?.appId as string),
  })

  const message = useMessage()

  const { data, execute, pending } = useRequest(() => getPlanList(query.value), {
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

  const onDelete = async (id: string) => {
    await deletePlan(id)
    message.success('删除成功')
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
