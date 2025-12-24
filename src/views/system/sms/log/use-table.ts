import type { TableProps, FormInstanceFunctions } from 'tdesign-vue-next'
import { getList, type ListQueryParams } from '@/api/system/sms/log'

export const columns: TableProps['columns'] = [
  { colKey: 'id', title: '编号', width: 60 },
  { colKey: 'mobile', title: '手机号', width: 140 },
  { colKey: 'templateContent', title: '模板内容', width: 240, ellipsis: true },
  { colKey: 'sendStatus', title: '发送状态', width: 100 },
  { colKey: 'channelCode', title: '短信渠道', width: 120 },
  { colKey: 'templateCode', title: '模板编号', width: 120 },
  { colKey: 'sendTime', title: '发送时间', width: 160 },
  { colKey: 'templateType', title: '短信类型', width: 100 },
  { colKey: 'actions', title: '操作', fixed: 'right', width: 80 },
]


export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const route = useRoute()
  const query = ref<ListQueryParams>({
    pageNo: 1,
    pageSize: 10,
    sendTime: [],
    templateSourceType: route.query?.templateSourceType as string,
  })

  const { data, pending, execute } = useRequest(() => getList(query.value), {
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
