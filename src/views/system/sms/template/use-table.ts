import type { TableProps, FormInstanceFunctions } from 'tdesign-vue-next'
import { getTemplateList, deleteTemplate, type ListQueryParams } from '@/api/system/sms/template'

export const columns: TableProps['columns'] = [
  { colKey: 'name', title: '模板名称', fixed: 'left', width: 180, ellipsis: true },
  { colKey: 'code', title: '模板编码', width: 180 },
  { colKey: 'content', title: '模板内容', width: 240, ellipsis: true },
  { colKey: 'type', title: '模板类型', width: 100 },
  { colKey: 'status', title: '状态', width: 100 },
  { colKey: 'channelCode', title: '短信渠道', width: 120 },
  { colKey: 'createTime', title: '创建时间', width: 160 },
  { colKey: 'actions', title: '操作', fixed: 'right', width: 140 },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const message = useMessage()
  const route = useRoute()

  const sourceType = route.query?.sourceType || ""

  const query = ref<ListQueryParams>({
    pageNo: 1,
    pageSize: 10,
    sourceType: sourceType as string,
    createTime: [],
  })

  const { data, pending, execute } = useRequest(() => getTemplateList(query.value), {
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
    await deleteTemplate(id)
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
