import useRequest from '@/hooks/use-request'
import { getDictDataList, deleteDictData, type ListQueryParams } from '@/api/system/dict/data'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { title: '字典编码', width: 90, colKey: 'id' },
  { title: '字典标签', colKey: 'label' },
  { title: '字典键值', width: 90, colKey: 'value' },
  { title: '字典状态', width: 90, colKey: 'status' },
  { title: '颜色类型', width: 140, colKey: 'colorType' },
  { title: 'CSS Class', colKey: 'cssClass' },
  { title: '备注', width: 140, colKey: 'remark' },
  {
    title: '创建时间',
    minWidth: 100,
    colKey: 'createTime',
  },
  { title: '操作', width: 100, colKey: 'actions' },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<ListQueryParams>({
    createTime: [],
    pageNo: 1,
    pageSize: 10,
  })

  const { params } = useRoute()

  const { data, execute, pending } = useRequest(() => getDictDataList(query.value))

  if (params.type) {
    query.value.dictType = params.type as string
    execute()
  }

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
    await deleteDictData(id)
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
