import useRequest from '@/hooks/use-request'
import {
  getAttachmentTypesList,
  deleteAttachmentType,
  type ListQueryParams,
} from '@/api/app/attachment'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'


export const columns: TableProps['columns'] = [
  { title: '附件类型', colKey: 'name', ellipsis: true },
  { title: '附件编码', colKey: 'moduleName', ellipsis: true },
  { title: '允许的类型', colKey: 'allowedFileTypes', width: 160, ellipsis: true },
  { title: '最大文件大小', colKey: 'maxFileSize', width: 160, ellipsis: true },
  { title: '必需附件', colKey: 'required', width: 100 },
  { title: '操作', width: 140, colKey: 'actions' },
]

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const route = useRoute()

  const query = ref<ListQueryParams>({
    pageNo: 1,
    pageSize: 10,
    appId: route.query?.appId as string || '',
  })

  const { data, execute, pending } = useRequest(() => getAttachmentTypesList(query.value), {
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

  const onDelete = async (id: string) => {
    await deleteAttachmentType(id)
    execute()
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
  }
}
