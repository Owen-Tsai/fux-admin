import useRequest from '@/hooks/use-request'
import {
  getInfoTypeTree,
  deleteInfoType,
  updateInfoTypeAudit,
  type TreeQueryParams,
} from '@/api/information/type'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { title: '资讯类别', colKey: 'name', ellipsis: true },
  { title: '排序', colKey: 'sort', width: 64 },
  { title: '需要审核', colKey: 'isAudit', width: 160 },
  { title: '状态', colKey: 'status', width: 100 },
  {
    title: '创建时间',
    width: 180,
    colKey: 'createTime',
  },
  { title: '操作', width: 160, colKey: 'actions' },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<TreeQueryParams>({
    name: '',
  })

  const message = useMessage()

  const { data, execute, pending } = useRequest(() => getInfoTypeTree(query.value), {
    immediate: true,
  })

  const onQueryChange = (reset?: boolean) => {
    if (reset) {
      formRef.value?.reset()
    }
    execute()
  }

  const onDelete = async (id: string) => {
    await deleteInfoType(id)
    message.success('删除成功')
    execute()
  }

  const onSetAudit = async (id: string, isAudit: boolean) => {
    pending.value = true
    await updateInfoTypeAudit(id, isAudit)
    message.success('操作成功')
    execute()
    pending.value = false
  }

  return {
    data,
    pending,
    query,
    onQueryChange,
    execute,
    onDelete,
    onSetAudit,
  }
}
