import type { TableProps, FormInstanceFunctions } from 'tdesign-vue-next'
import { getAllMessageList, type ListQueryParams } from '@/api/system/message'

export const columns: TableProps['columns'] = [
  { colKey: 'id', title: '编号', width: 50 },
  { colKey: 'userId', title: '接收人', width: 140 },
  { colKey: 'templateContent', title: '模板内容', width: 240, ellipsis: true },
  { colKey: 'readStatus', title: '已读', width: 60 },
  { colKey: 'template', title: '模板', width: 120, ellipsis: true },
  // { colKey: 'templateType', title: '模板类型', width: 100 },
  { colKey: 'createTime', title: '发送时间', width: 140 },
  { colKey: 'actions', title: '操作', fixed: 'right', width: 60 },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<ListQueryParams>({
    pageNo: 1,
    pageSize: 10,
  })

  const { data, pending, execute } = useRequest(() => getAllMessageList(query.value), {
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
