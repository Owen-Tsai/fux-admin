import dayjs from 'dayjs'
import useRequest from '@/hooks/use-request'
import {
  getDictTypeList,
  deleteDictType,
  type ListQueryParams,
  type DictTypeVO,
} from '@/api/system/dict/type'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { title: '字典编号', width: 90, colKey: 'id' },
  { title: '字典名称', colKey: 'name' },
  { title: '字典类别', colKey: 'type' },
  { title: '字典状态', width: 90, colKey: 'status' },
  { title: '备注', width: 200, colKey: 'remark', ellipsis: true },
  {
    title: '创建时间',
    minWidth: 120,
    colKey: 'createTime',
  },
  { title: '操作', width: 150, colKey: 'actions' },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<ListQueryParams>({
    createTime: [],
    pageNo: 1,
    pageSize: 10,
  })

  const { push } = useRouter()

  const { data, execute, pending } = useRequest(() => getDictTypeList({ ...query.value }), {
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
    await deleteDictType(id)
    execute()
  }

  const onShowData = async (type: string) => {
    push(`/system/dict/data/${type}`)
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
    onShowData,
  }
}
