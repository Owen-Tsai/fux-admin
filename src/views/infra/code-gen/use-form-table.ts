import type { TableProps, FormInstanceFunctions } from 'tdesign-vue-next'
import { getTableDefList, type TableQueryParams } from '@/api/infra/code-gen'

export const columns: TableProps['columns'] = [
  { colKey: 'row-select', type: 'multiple' },
  { colKey: 'name', title: '表名称' },
  { colKey: 'comment', title: '表描述' },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<TableQueryParams>({
    dataSourceConfigId: 0,
  })

  const { data, pending, execute } = useRequest(() => getTableDefList(query.value), {
    immediate: true,
  })

  const onQueryChange = (reset?: boolean) => {
    if (reset) {
      formRef.value?.reset({ type: 'initial' })
    }
    execute()
  }

  return {
    query,
    execute,
    data,
    pending,
    onQueryChange,
  }
}
