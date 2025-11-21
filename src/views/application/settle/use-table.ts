import { getTalentSettleList,deleteTalentSettle, type ListQueryParams } from '@/api/application/settle'
import type { TableProps,FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
    { colKey: 'name', title: '姓名' },
    { colKey: 'idcard', title: '身份证号码' },
    { colKey: 'diploma', title: '学历' },
    { colKey: 'countyCode', title: '所在区县' },
    { colKey: 'streetCode', title: '所在街道' },
    { colKey: 'address', title: '落户地址' },
    { colKey: 'settlementTime', title: '落户时间' },
    { colKey: 'actions', title: '操作', width: 240 }
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
    const query = ref<ListQueryParams>({
                    name: '',
                    idcard: '',
                    diploma: '',
                    countyCode: '',
                    streetCode: '',
                    address: '',
                    settlementTime: [],
        pageNo: 1,
        pageSize: 10,
    })

    const { data, pending, execute } = useRequest(() => getTalentSettleList(query.value), {
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
        await deleteTalentSettle(id)
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
