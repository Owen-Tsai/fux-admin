import { getUsers, type ListQueryParams } from '@/api/system/user'
import type { TableProps, FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { colKey: 'id', title: '编号', width: 120 },
  { colKey: 'username', title: '用户账号', width: 160 },
  { colKey: 'nickname', title: '用户名称', width: 160 },
  { colKey: 'deptName', title: '所属部门', width: 120 },
  { colKey: 'mobile', title: '绑定手机', ellipsis: true },
  { colKey: 'status', title: '状态' },
  { colKey: 'createTime', title: '注册时间', width: 140 },
  { colKey: 'actions', title: '操作', fixed: 'right', width: 110 },
]

export const useUserTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<ListQueryParams>({
    createTime: [],
  })

  const { data, pending, execute } = useRequest(() => getUsers(query.value), {
    immediate: true,
  })

  const pagination = computed<TableProps['pagination']>(() => ({
    pageSize: query.value.pageSize,
    current: query.value.pageNo,
    total: data.value?.total,
    showPageSize: true,
  }))

  const onPageChange: TableProps['onPageChange'] = ({ current, pageSize }) => {
    query.value.pageNo = current
    query.value.pageSize = pageSize

    execute()
  }

  const onQueryChange = (reset?: boolean) => {
    if (reset) {
      formRef.value?.reset()
    }
    query.value.pageNo = 1
    execute()
  }

  return {
    data,
    query,
    pending,
    pagination,
    onPageChange,
    onQueryChange,
  }
}
