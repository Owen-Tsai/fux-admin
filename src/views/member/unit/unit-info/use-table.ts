import useRequest from '@/hooks/use-request'
import { getList, type ListQueryParams } from '@/api/member/unit/unit-info'
import type { FormInstance, TableProps } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'

export const columns: TableProps['columns'] = [
  { key: 'name', title: '单位名称', dataIndex: 'name' },
  { key: 'username', title: '用户名', dataIndex: 'username' },
  //{ key: 'email', title: 'email', dataIndex: 'email' },
  //{ key: 'regdate', title: '注册时间', dataIndex: 'regdate' },
  //{ key: 'code', title: '单位编码', dataIndex: 'code' },
  { key: 'creditrate', title: '统一社会信用代码', dataIndex: 'creditrate' },
  //{ key: 'unitnature', title: '单位性质', dataIndex: 'unitnature' },
  //{ key: 'contact', title: '联系人', dataIndex: 'contact' },
  //{ key: 'mobile', title: '手机号', dataIndex: 'mobile' },
  { key: 'telphone', title: '电话', dataIndex: 'telphone' },
  //{ key: 'lastlogondate', title: '最后登录时间', dataIndex: 'lastlogondate' },
  { key: 'legalrepresent', title: '法定代表人', dataIndex: 'legalrepresent' },
  //{ key: 'isenable', title: '是否可用', dataIndex: 'isenable' },
  //{ key: 'createTime', title: '创建时间', dataIndex: 'createTime' },
  //{ key: 'unitType', title: '单位类型', dataIndex: 'unitType' },
  {
    title: '允许登录',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
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
