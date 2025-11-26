import { getList, setEnabled, type ListQueryParams } from '@/api/member/personal'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { colKey: 'name', title: '单位名称', width: 160, ellipsis: true, fixed: 'left' },
  { colKey: 'creditrate', title: '统一信用代码', width: 180, ellipsis: true },
  { colKey: 'unitNature', title: '单位性质', width: 120 },
  { colKey: 'scale', title: '单位规模', width: 120 },
  { colKey: 'regFund', title: '注册资金', width: 120 },
  { colKey: '' },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<ListQueryParams>({
    pageNo: 1,
    pageSize: 10,
    birthday: [],
  })

  const message = useMessage()
  const logger = useLogger()

  const { data, execute, pending } = useRequest(() => getList(query.value), {
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

  const onSetEnable = async (id: string, enabled: boolean) => {
    pending.value = true
    try {
      await setEnabled(id, enabled)
      message.success('操作成功')
      execute()
    } catch (error) {
      logger.error(import.meta.url, '设置是否允许登录失败', error)
      message.error('操作失败')
    } finally {
      pending.value = false
    }
  }

  return {
    data,
    query,
    execute,
    pending,
    pagination,
    onPageChange,
    onQueryChange,
    onSetEnable,
  }
}
