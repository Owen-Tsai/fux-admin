import { getReserveFundLoanList,deleteReserveFundLoan, type ListQueryParams } from '@/api/application/loan'
import type { TableProps,FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { colKey: 'borrowerName', title: '借款人姓名' },
  { colKey: 'borrowerIdcard', title: '借款人证件号码' },
  { colKey: 'loanTotal', title: '贷款总额' },
  { colKey: 'fundLoanAmount', title: '公积金贷款金额' },
  { colKey: 'unitName', title: '单位名称' },
  { colKey: 'phone', title: '手机号码' },
  { colKey: 'actions', title: '操作', width: 240 }
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
    const query = ref<ListQueryParams>({
                    loanTotal: '',
                    fundLoanAmount: '',
                    borrowerName: '',
                    borrowerIdcard: '',
                    unitName: '',
                    phone: '',
        pageNo: 1,
        pageSize: 10,
    })

    const { data, pending, execute } = useRequest(() => getReserveFundLoanList(query.value), {
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
        await deleteReserveFundLoan(id)
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
