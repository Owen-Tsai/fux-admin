import useRequest from '@/hooks/use-request'
import { getList, type ListQueryParams } from '@/api/system/abip'
import type { FormInstance, TableProps } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'

export const columns: TableProps['columns'] = [
  { key: 'ipAddress', title: '异常 IP 地址', dataIndex: 'ipAddress' },
  { key: 'abnormalType', title: '异常类型', dataIndex: 'abnormalType' },
  // { key: 'createTime', title: '添加时间', dataIndex: 'createTime' },
  { key: 'accessTime', title: '访问时间', dataIndex: 'accessTime' },
  //{ key: 'accessResource', title: '访问的资源', dataIndex: 'accessResource' },
  { key: 'handlingStatus', title: '处理状态', dataIndex: 'handlingStatus' },
  { key: 'actions', title: '操作', dataIndex: 'actions', width: 240 },
]

export const useTable = (filterFormRef: Ref<FormInstance | undefined>) => {
  const queryParams = ref<ListQueryParams>({})

  const { data, pending, execute } = useRequest(() => getList(queryParams.value), {
    immediate: true,
  })

  const pagination = computed<TablePaginationConfig>(() => ({
    pageSize: queryParams.value.pageSize,
    current: queryParams.value.pageNo,
    total: data.value?.total,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal(total, range) {
      return `第 ${range[0]}~${range[1]} 项 / 共 ${total} 项`
    },
  }))

  const onChange = ({ current, pageSize }: TablePaginationConfig) => {
    queryParams.value.pageNo = current
    queryParams.value.pageSize = pageSize

    execute()
  }

  const onFilter = () => {
    queryParams.value.pageNo = 1
    execute()
  }

  const onFilterReset = () => {
    filterFormRef.value?.resetFields()
    queryParams.value.pageNo = 1
    execute()
  }

  return {
    data,
    pending,
    execute,
    pagination,
    queryParams,
    onFilter,
    onFilterReset,
    onChange,
  }
}
