import { getSocialInfoList,deleteSocialInfo, type ListQueryParams } from '@/api/application/imported/social'
import type { TableProps,FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
    { colKey: 'unitSocialCode', title: '单位编号' },
    { colKey: 'unitName', title: '单位名称' },
    { colKey: 'personalNo', title: '个人编号' },
    { colKey: 'name', title: '姓名' },
    { colKey: 'payYearmonth', title: '缴费年月' },
    { colKey: 'payStatus', title: '缴费状态' },
    { colKey: 'createTime', title: '创建时间' },
    { colKey: 'actions', title: '操作', width: 240 }
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
    const query = ref<ListQueryParams>({
                    unitSocialCode: '',
                    unitName: '',
                    personalNo: '',
                    name: '',
                    payYearmonth: [],
                    payStatus: '',
                    createTime: [],
        pageNo: 1,
        pageSize: 10,
    })

    const { data, pending, execute } = useRequest(() => getSocialInfoList(query.value), {
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
        await deleteSocialInfo(id)
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
