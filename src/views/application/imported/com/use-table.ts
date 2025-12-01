import { getComInfoList,deleteComInfo, type ListQueryParams } from '@/api/application/imported/com'
import type { TableProps,FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
    { colKey: 'name', title: '企业名称' },
    { colKey: 'enterpriseType', title: '企业类型' },
    { colKey: 'establishDate', title: '成立日期' },
    { colKey: 'legalRep', title: '法定代表人' },
    { colKey: 'domicile', title: '住所' },
    { colKey: 'approveDate', title: '核准日期' },
    { colKey: 'businessTermStart', title: '经营期限自' },
    { colKey: 'businessTermEnd', title: '经营期限至' },
    { colKey: 'businessScope', title: '经营范围' },
    { colKey: 'registeredCapital', title: '注册资本' },
    { colKey: 'currency', title: '注册资本币种' },
    { colKey: 'registrationNo', title: '注册号' },
    { colKey: 'creditCode', title: '统一社会信用代码' },
    { colKey: 'registrationAuth', title: '登记机关' },
    { colKey: 'registrationStatus', title: '登记状态' },
    { colKey: 'nodeNo', title: '节点号' },
    { colKey: 'createTime', title: '创建时间' },
    { colKey: 'actions', title: '操作', width: 240 }
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
    const query = ref<ListQueryParams>({
                    name: '',
                    enterpriseType: '',
                    establishDate: [],
                    legalRep: '',
                    domicile: '',
                    approveDate: [],
                    businessTermStart: [],
                    businessTermEnd: [],
                    businessScope: '',
                    registeredCapital: '',
                    currency: '',
                    registrationNo: '',
                    creditCode: '',
                    registrationAuth: '',
                    registrationStatus: '',
                    nodeNo: '',
                    createTime: [],
        pageNo: 1,
        pageSize: 10,
    })

    const { data, pending, execute } = useRequest(() => getComInfoList(query.value), {
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
        await deleteComInfo(id)
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
