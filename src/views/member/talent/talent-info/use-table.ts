import useRequest from '@/hooks/use-request'
import { getList, type ListQueryParams } from '@/api/member/talent/talent-info'
import type { FormInstance, TableProps } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue/es/table/interface'

export const columns: TableProps['columns'] = [
  { key: 'username', title: '用户名', dataIndex: 'username' },
  { key: 'idcard', title: '身份证号', dataIndex: 'idcard' },
  { key: 'name', title: '姓名', dataIndex: 'name' },
  { key: 'sex', title: '性别', dataIndex: 'sex' },
  { key: 'birthday', title: '出生年月', dataIndex: 'birthday' },
  { key: 'diploma', title: '学历', dataIndex: 'diploma' },
  { key: 'mobile', title: '手机号', dataIndex: 'mobile' },
  // { key: 'eduschool', title: '毕业院校', dataIndex: 'eduschool' },
  { key: 'isenable', title: '允许登录', dataIndex: 'isenable' },
  // { key: 'regdate', title: '注册时间', dataIndex: 'regdate' },
  // { key: 'isrecommend', title: '是否推荐', dataIndex: 'isrecommend' },
  // { key: 'degree', title: '学位', dataIndex: 'degree' },
  // { key: 'createTime', title: '创建时间', dataIndex: 'createTime' },
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
