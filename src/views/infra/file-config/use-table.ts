import useRequest from '@/hooks/use-request'
import {
  getConfigList,
  deleteConfig,
  setMaster,
  testConfig,
  type ListQueryParams,
} from '@/api/infra/file/config'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { title: '配置名称', colKey: 'name', ellipsis: true },
  { title: '存储器', colKey: 'storage', width: 120 },
  { title: '备注', colKey: 'remark', ellipsis: true },
  {
    title: '创建时间',
    width: 180,
    colKey: 'createTime',
  },
  { title: '操作', width: 180, colKey: 'actions' },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const dialog = useDialog()
  const message = useMessage()

  const query = ref<ListQueryParams>({
    pageNo: 1,
    pageSize: 10,
  })

  const { data, execute, pending } = useRequest(() => getConfigList(query.value), {
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
    const instance = dialog.confirm({
      header: '删除文件配置',
      body: '确定要删除吗？该操作无法恢复',
      onConfirm: async () => {
        await deleteConfig(id)
        execute()
        message.success('删除成功')
        instance.destroy()
      },
    })
  }

  const onSetMaster = async (id: number) => {
    pending.value = true
    await setMaster(id)
    message.success('设置成功')
    execute()
  }

  const onTest = async (id: number) => {
    try {
      const res = await testConfig(id)
      dialog.info({
        theme: 'success',
        header: '测试成功',
        body: `文件预览地址：${res}`,
        confirmBtn: null,
      })
    } catch (e) {
      console.error(e)
      dialog.info({
        theme: 'warning',
        header: '测试失败',
        body: `请检查错误日志或控制台`,
        confirmBtn: null,
      })
    }
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
    onSetMaster,
    onTest,
  }
}
