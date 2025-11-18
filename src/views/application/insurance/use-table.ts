import { getMedicalInsuranceList,deleteMedicalInsurance, type ListQueryParams } from '@/api/application/insurance'
import type { TableProps,FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
    { colKey: 'idcard', title: '参保人证件号' },
    { colKey: 'name', title: '参保人姓名' },
    { colKey: 'companyName', title: '缴费单位名称' },
    { colKey: 'orgNum', title: '统一社会信用代码' },
    { colKey: 'status', title: '人员参保状态' },
    { colKey: 'startDate', title: '开始时间' },
    { colKey: 'actions', title: '操作', width: 240 }
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
    const query = ref<ListQueryParams>({
                    idcard: '',
                    name: '',
                    companyName: '',
                    orgNum: '',
                    status: '',
                    startDate: [],
        pageNo: 1,
        pageSize: 10,
    })

    const { data, pending, execute } = useRequest(() => getMedicalInsuranceList(query.value), {
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
        await deleteMedicalInsurance(id)
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
