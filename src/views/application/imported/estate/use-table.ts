import { getEstateInfoList,deleteEstateInfo, type ListQueryParams } from '@/api/application/imported/estate'
import type { TableProps,FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
    { colKey: 'certNo', title: '不动产权证号' },
    { colKey: 'unitNo', title: '不动产单元号' },
    { colKey: 'ownershipStatus', title: '权属状态' },
    { colKey: 'location', title: '坐落' },
    { colKey: 'buildingArea', title: '建筑面积' },
    { colKey: 'floor', title: '所在层' },
    { colKey: 'totalFloors', title: '总层数' },
    { colKey: 'completionTime', title: '竣工时间' },
    { colKey: 'createTime', title: '创建时间' },
    { colKey: 'actions', title: '操作', width: 240 }
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
    const query = ref<ListQueryParams>({
                    certNo: '',
                    unitNo: '',
                    ownershipStatus: '',
                    location: '',
                    buildingArea: '',
                    floor: '',
                    totalFloors: '',
                    completionTime: [],
                    createTime: [],
        pageNo: 1,
        pageSize: 10,
    })

    const { data, pending, execute } = useRequest(() => getEstateInfoList(query.value), {
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
        await deleteEstateInfo(id)
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
