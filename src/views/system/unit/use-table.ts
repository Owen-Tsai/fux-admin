import { getUnitList,deleteUnit,getUnitTree, type ListQueryParams } from '@/api/system/unit'
import type { TableProps,FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
    { colKey: 'name', title: '单位名称' },
    { colKey: 'code', title: '单位编码' },
    { colKey: 'sort', title: '显示顺序' },
    { colKey: 'status', title: '单位状态' },
    { colKey: 'createTime', title: '创建时间' },
    { colKey: 'actions', title: '操作', width: 240 }
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
    const query = ref<ListQueryParams>({
                    name: '',
                    code: '',
                    status: 0,
        pageNo: 1,
        pageSize: 10,
    })

    const { data, pending, execute } = useRequest(() => getUnitList(query.value), {
        immediate: true,
    })

    const { data: treeData, execute: getUserList } = useRequest(getUnitTree, {
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
        await deleteUnit(id)
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
        treeData,
    }
}