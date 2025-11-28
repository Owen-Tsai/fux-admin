import { getHighCreateGroupList,deleteHighCreateGroup, type ListQueryParams } from '@/api/application/high'
import type { TableProps,FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
    // { colKey: 'idcard', title: '身份证号' },
    { colKey: 'companyName', title: '企业名称' },
    { colKey: 'projectName', title: '项目名称' },
    { colKey: 'teamLeader', title: '团队带头人' },
    // { colKey: 'industryType', title: '产业类别' },
    // { colKey: 'investmentAmount', title: '投资金额' },
    { colKey: 'landingCounty', title: '落地县区' },
    { colKey: 'contactPerson', title: '联系人' },
    // { colKey: 'createTime', title: '创建时间' },
    { colKey: 'actions', title: '操作', width: 240 }
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
    const query = ref<ListQueryParams>({
                    idcard: '',
                    companyName: '',
                    projectName: '',
                    teamLeader: '',
                    industryType: '',
                    investmentAmount: '',
                    landingCounty: '',
                    contactPerson: '',
                    createTime: [],
        pageNo: 1,
        pageSize: 10,
    })

    const { data, pending, execute } = useRequest(() => getHighCreateGroupList(query.value), {
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
        await deleteHighCreateGroup(id)
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
