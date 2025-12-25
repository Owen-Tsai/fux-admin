import type { TableProps, FormInstanceFunctions } from 'tdesign-vue-next'
import { getDeptTree, deleteDept,getChildrenRegions, type TreeQueryParams } from '@/api/system/dept'
import { getSimpleUserList } from '@/api/system/user'
import { getUnitTree } from '@/api/system/unit'

export const columns: TableProps['columns'] = [
  { colKey: 'name', title: '部门名称' },
  { colKey: 'unitId', title: '所属单位' },
  { colKey: 'leaderUserId', title: '负责人' },
  { colKey: 'sort', title: '排序' },
  { colKey: 'status', title: '状态' },
  { colKey: 'createTime', title: '创建时间' },
  { colKey: 'actions', title: '操作' },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<TreeQueryParams>({
    name: undefined,
    status: undefined,
  })
  const message = useMessage()

  const { data, pending, execute } = useRequest(() => getDeptTree(query.value), {
    immediate: true,
  })

  const { data: userList, execute: getUserList } = useRequest(getSimpleUserList, {
    immediate: true,
  })

  const { data: unitTreeList, execute: getUnit } = useRequest(getUnitTree, {
    immediate: true,
  })
  const { data: regionList, execute: getRegions } = useRequest(()=> getChildrenRegions('1'), {
    immediate: true,
  })
  const onQueryChange = (reset?: boolean) => {
    if (reset) {
      formRef.value?.reset({ type: 'initial' })
    }

    execute()
  }

  const onDelete = async (id: number) => {
    await deleteDept(id)
    message.success('删除成功')
    execute()
  }

  return {
    data,
    pending,
    execute,
    query,
    onQueryChange,
    onDelete,
    userList,
    getUserList,
    unitTreeList,
    regionList,
  }
}
