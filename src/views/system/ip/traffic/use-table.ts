import { getTrafficList, type ListQueryParams } from '@/api/system/ip/traffic'
import type { TableProps, FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { colKey: 'ipAddress', title: 'IP 地址', width: 200 },
  { colKey: 'inboundTraffic', title: '入站流量' },
  { colKey: 'outboundTraffic', title: '出站流量' },
  { colKey: 'trafficTime', title: '流量统计时间' },
  { colKey: 'actions', title: '操作', fixed: 'right', width: 180 },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<ListQueryParams>({
    pageNo: 1,
    pageSize: 10,
    trafficTime: [],
  })

  const { data, pending, execute } = useRequest(() => getTrafficList(query.value), {
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
