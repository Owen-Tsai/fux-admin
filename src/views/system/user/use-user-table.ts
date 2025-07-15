import { getUsers, deleteUser, updateUserStatus, type ListQueryParams } from '@/api/system/user'
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
  const dialog = useDialog()
  const message = useMessage()
  // only used in dialog button
  const loading = ref(false)

  const query = ref<ListQueryParams>({
    createTime: [],
    pageNo: 1,
    pageSize: 10,
  })

  const { data, pending, execute } = useRequest(() => getUsers(query.value), {
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
    if (reset) {
      formRef.value?.reset()
    }
    query.value.pageNo = 1
    execute()
  }

  const onDelete = async (id: number) => {
    const instance = dialog.confirm({
      theme: 'danger',
      showOverlay: true,
      header: '删除用户',
      body: '确定要删除用户吗？删除的用户将无法登录和访问系统。',
      confirmLoading: loading.value,
      async onConfirm() {
        loading.value = true
        try {
          await deleteUser(id)
          instance.destroy()
          message.success('删除成功')
          execute()
        } catch (e) {
        } finally {
          loading.value = false
        }
      },
    })
  }

  const onSetStatus = async (id: number, status: number) => {
    try {
      await updateUserStatus(id, status)
      message.success('操作成功')
    } finally {
      execute()
    }
  }

  return {
    data,
    query,
    pending,
    execute,
    pagination,
    onPageChange,
    onQueryChange,
    onDelete,
    onSetStatus,
  }
}
