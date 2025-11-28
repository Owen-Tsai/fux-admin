import { getInsurInfoList,deleteInsurInfo, type ListQueryParams } from '@/api/application/imported/insur'
import type { TableProps,FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
    { colKey: 'idcard', title: '身份证号' },
    { colKey: 'payPeriod', title: '缴费期别' },
    { colKey: 'payBase', title: '缴费基数' },
    { colKey: 'payAmount', title: '缴费金额' },
    { colKey: 'unitNo', title: '单位编号' },
    { colKey: 'insuredAreaCode', title: '参保地行政区划代码' },
    { colKey: 'personalIdentity', title: '个人身份' },
    { colKey: 'payYearmonth', title: '缴费年月' },
    { colKey: 'createTime', title: '创建时间' },
    { colKey: 'actions', title: '操作', width: 240 }
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
    const query = ref<ListQueryParams>({
                    idcard: '',
                    payPeriod: '',
                    payBase: '',
                    payAmount: '',
                    unitNo: '',
                    insuredAreaCode: '',
                    personalIdentity: '',
                    payYearmonth: [],
                    createTime: [],
        pageNo: 1,
        pageSize: 10,
    })

    const { data, pending, execute } = useRequest(() => getInsurInfoList(query.value), {
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
        await deleteInsurInfo(id)
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
