import { getYouthCreateList,deleteYouthCreate, type ListQueryParams } from '@/api/application/youth'
import type { TableProps,FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
    { colKey: 'idcard', title: '身份证号' },
    { colKey: 'name', title: '姓名' },
    { colKey: 'birthday', title: '出生年月' },
    { colKey: 'diploma', title: '学历' },
    { colKey: 'professionalTitle', title: '职称' },
    { colKey: 'workUnit', title: '工作单位' },
    { colKey: 'techField', title: '技术领域' },
    // { colKey: 'talentTitle', title: '人才称号' },
    // { colKey: 'supportFund', title: '支持资金' },
    // { colKey: 'selectionYear', title: '入选年度' },
    { colKey: 'county', title: '所在县区' },
    // { colKey: 'contact', title: '本人联系方式' },
    // { colKey: 'projectResult', title: '项目验收结果' },
    // { colKey: 'createTime', title: '创建时间' },
    { colKey: 'actions', title: '操作', width: 240 }
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
    const query = ref<ListQueryParams>({
                    idcard: '',
                    name: '',
                    birthday: [],
                    diploma: '',
                    professionalTitle: '',
                    workUnit: '',
                    techField: '',
                    talentTitle: '',
                    supportFund: '',
                    selectionYear: '',
                    county: '',
                    contact: '',
                    projectResult: '',
                    createTime: [],
        pageNo: 1,
        pageSize: 10,
    })

    const { data, pending, execute } = useRequest(() => getYouthCreateList(query.value), {
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
        await deleteYouthCreate(id)
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
