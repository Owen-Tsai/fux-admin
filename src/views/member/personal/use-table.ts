import { getList, setEnabled, type ListQueryParams } from '@/api/member/personal'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { colKey: 'name', title: '姓名', width: 120, fixed: 'left' },
  { colKey: 'companyName', title: '供职单位', width: 160, ellipsis: true },
  { colKey: 'age', title: '年龄', width: 80 },
  { colKey: 'sex', title: '性别', width: 80 },
  { colKey: 'politicalStatus', title: '政治面貌', width: 120 },
  { colKey: 'diploma', title: '学历', width: 120 },
  { colKey: 'diplomaType', title: '学历类型', width: 120 },
  { colKey: 'degree', title: '学位', width: 120 },
  { colKey: 'mobile', title: '手机号', width: 140 },
  { colKey: 'email', title: '邮箱', width: 180, ellipsis: true },
  { colKey: 'regdate', title: '注册时间', width: 160 },
  { colKey: 'isEnabled', title: '允许登录', width: 120, fixed: 'right' },
  { colKey: 'actions', title: '操作', width: 120, fixed: 'right' },
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
