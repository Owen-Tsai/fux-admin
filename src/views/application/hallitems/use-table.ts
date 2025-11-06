import {
  deleteHallItems,
  getHallItemsList,
  setPublishedStatus,
  setHotStatus,
  type ListQueryParams,
  type HallItemsVO
} from '@/api/application/hallitems'
import type { FormInstanceFunctions, TableProps } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { colKey: 'itemName', title: '事项名称' },
  { colKey: 'iconPath', title: '事项图标', width: 100 },
  { colKey: 'description', title: '事项描述' },
  { colKey: 'linkUrl', title: '事项入口链接' },
  { colKey: 'status', title: '状态', width: 100 },
  { colKey: 'isHot', title: '是否热门', width: 100 },
  { colKey: 'createTime', title: '创建时间' },
  { colKey: 'actions', title: '操作', width: 120 },
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const query = ref<ListQueryParams>({
    itemName: '',
    pageNo: 1,
    pageSize: 10,
  })

  const { data, pending, execute } = useRequest(() => getHallItemsList(query.value), {
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
    await deleteHallItems(id)
    execute()
  }

  /**
   * 设置发布状态
   */
  const onSetPublishedStatus = async (row: HallItemsVO, status: number) => {
    pending.value = true
    row.status = status
    await setPublishedStatus(row)
    execute()
    pending.value = false
  }

  /**
   * 设置是否热门
   */
  const onSetHotStatus = async (row: HallItemsVO, hot: boolean) => {
    pending.value = true
    row.isHot = hot
    await setHotStatus(row)
    execute()
    pending.value = false
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
    onSetPublishedStatus,
    onSetHotStatus
  }
}
