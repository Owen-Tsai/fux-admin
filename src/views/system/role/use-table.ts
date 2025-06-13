import useRequest from '@/hooks/use-request'
import { getRolesList, deleteRole, type ListQueryParams } from '@/api/system/role'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'name', title: '角色名称' },
  { colKey: 'code', title: '角色标识' },
  { colKey: 'status', title: '状态' },
  { colKey: 'remark', title: '备注' },
  { colKey: 'createTime', title: '创建时间' },
  { colKey: 'actions', title: '操作', width: 120 },
]

export const useTable = (filterFormRef: Ref<FormInstanceFunctions | null>) => {
  const loading = ref(false)
  const message = useMessage()
  const dialog = useDialog()

  const query = ref<ListQueryParams>({
    createTime: [],
    pageNo: 1,
    pageSize: 10,
  })

  const { data, pending, execute } = useRequest(() => getRolesList(query.value), {
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
      filterFormRef.value?.reset()
    }
    execute()
  }

  const onDelete = async (id: number) => {
    loading.value = true
    const instance = dialog.confirm({
      theme: 'danger',
      showOverlay: true,
      header: '删除角色',
      body: '确定要删除角色吗？已经具有被分配该角色的用户使用系统时可能受影响',
      confirmLoading: loading.value,
      async onConfirm() {
        try {
          await deleteRole(id)
          instance.destroy()
          execute()
          message.success('删除成功')
        } catch (e) {
        } finally {
          loading.value = false
        }
      },
    })
  }

  return {
    data,
    pending,
    execute,
    pagination,
    query,
    onQueryChange,
    onPageChange,
    onDelete,
  }
}
