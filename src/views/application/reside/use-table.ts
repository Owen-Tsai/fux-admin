import { getResideCardList,deleteResideCard, type ListQueryParams } from '@/api/application/reside'
import type { TableProps,FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
    { colKey: 'name', title: '姓名' },
    { colKey: 'idcard', title: '身份证号码' },
    { colKey: 'registeredAddress', title: '户籍地' },
    { colKey: 'currentAddress', title: '现居住地' },
    { colKey: 'issueTime', title: '核发时间' },
    { colKey: 'actions', title: '操作', width: 240 }
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
    const query = ref<ListQueryParams>({
                    name: '',
                    idcard: '',
                    registeredAddress: '',
                    currentAddress: '',
                    issueTime: [],
        pageNo: 1,
        pageSize: 10,
    })

    const { data, pending, execute } = useRequest(() => getResideCardList(query.value), {
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
        await deleteResideCard(id)
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
