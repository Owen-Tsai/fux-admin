import { getMenuTree, deleteMenu, type TreeQueryParams } from '@/api/system/menu'
import { sessionCache } from '@/utils/storage'
import type { TableProps, FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { colKey: 'name', title: '菜单名称', width: 180, ellipsis: true, fixed: 'left' },
  { colKey: 'type', title: '类型', width: 80 },
  { colKey: 'sort', title: '排序', width: 80 },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'path', title: '路由', ellipsis: true },
  { colKey: 'permission', title: '权限标识', ellipsis: true },
  { colKey: 'component', title: '组件路径', ellipsis: true },
  { colKey: 'componentName', title: '组件名称', ellipsis: true },
  { colKey: 'actions', title: '操作', fixed: 'right', width: 220 },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<TreeQueryParams>({})
  const message = useMessage()

  const { data, pending, execute } = useRequest(() => getMenuTree(query.value), { immediate: true })

  const onQueryChange = (reset?: boolean) => {
    if (reset === true) {
      formRef.value?.reset()
    }
    execute()
  }

  const onDelete = async (id: number) => {
    await deleteMenu(id)
    message.success('删除成功')
    execute()
  }

  const onClearCache = () => {
    sessionCache.delete('permission-info')
    window.location.reload()
  }

  return {
    data,
    pending,
    execute,
    query,
    onQueryChange,
    onDelete,
    onClearCache,
  }
}
