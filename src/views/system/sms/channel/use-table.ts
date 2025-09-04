import type { TableProps, FormInstanceFunctions } from 'tdesign-vue-next'
import { getChannelList, deleteChannel, type ListQueryParams } from '@/api/system/sms/channel'

export const columns: TableProps['columns'] = [
  { colKey: 'id', title: '编号', width: 64 },
  { colKey: 'signature', title: '渠道名称' },
  { colKey: 'code', title: '渠道编码' },
  { colKey: 'status', title: '状态' },
  { colKey: 'apiKey', title: 'API Key', ellipsis: true },
  { colKey: 'createTime', title: '创建时间' },
  { colKey: 'actions', title: '操作' },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const message = useMessage()

  const query = ref<ListQueryParams>({
    pageNo: 1,
    pageSize: 10,
    status: 0,
    createTime: [],
  })

  const { data, pending, execute } = useRequest(() => getChannelList(query.value), {
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
    await deleteChannel(id)
    message.success('删除成功')
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
    onDelete,
  }
}
