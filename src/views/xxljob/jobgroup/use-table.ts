import { deleteJobGroup, getJobGroupList, type ListQueryParams } from '@/api/xxljob/jobgroup'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { colKey: 'appName', title: 'AppName' },
  { colKey: 'title', title: '名称' },
  { colKey: 'addressType', title: '注册方式' },
  { colKey: 'addressList', title: '在线机器地址' },
  { colKey: 'actions', title: '操作', width: 240 },
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<ListQueryParams>({
    appName: '',
    title: '',
    addressType: undefined,
    addressList: '',
    pageNo: 1,
    pageSize: 10,
  })

  const { data, pending, execute } = useRequest(() => getJobGroupList(query.value), {
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
    await deleteJobGroup(id)
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
