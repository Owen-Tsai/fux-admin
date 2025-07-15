import useRequest from '@/hooks/use-request'
import {
  getTypeTree,
  updateInfoType,
  type TypeQueryParams,
  type InformationTypeVO,
} from '@/api/information/type'
import type { TableProps, FormInstance } from 'ant-design-vue'

export const columns: TableProps['columns'] = [
  { key: 'name', title: '类别名称', dataIndex: 'name', width: '220px' },
  { key: 'sort', title: '排序', dataIndex: 'sort' },
  { key: 'isAudit', title: '是否需要审核', dataIndex: 'isAudit' },
  { key: 'status', title: '状态', dataIndex: 'status' },
  { key: 'creator', title: '创建者', dataIndex: 'creator' },
  { key: 'createTime', title: '创建时间', dataIndex: 'createTime', width: '220px' },
  { key: 'actions', title: '操作', width: '220px' },
]

export const useTable = (formRef: Ref<FormInstance>) => {
  const { data, pending, execute } = useRequest(() => getTypeTree(queryParams.value), {
    immediate: true,
  })

  // execute()

  const queryParams = ref<TypeQueryParams>({})

  const onFilter = () => {
    execute()
  }

  const onChange = (data: InformationTypeVO) => {
    updateInfoType({
      id: data.id,
      isAudit: data.isAudit,
    })
      .then(() => {
        execute()
      })
      .catch(() => {
        data.isAudit = !data.isAudit
      })
  }

  const onFilterReset = () => {
    formRef.value?.resetFields()
    execute()
  }
  // onMounted(() => execute())

  return {
    data,
    pending,
    execute,
    queryParams,
    onFilter,
    onFilterReset,
    onChange,
  }
}
