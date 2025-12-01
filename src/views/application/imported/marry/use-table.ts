import { getMarryInfoList,deleteMarryInfo, type ListQueryParams } from '@/api/application/imported/marry'
import type { TableProps,FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
    { colKey: 'femaleName', title: '女方姓名' },
    { colKey: 'femaleIdcard', title: '女方身份证件号码' },
    { colKey: 'maleName', title: '男方姓名' },
    { colKey: 'maleIdcard', title: '男方身份证件号码' },
    { colKey: 'registerDate', title: '登记日期' },
    { colKey: 'maritalStatus', title: '婚姻状况' },
    { colKey: 'registerAuthority', title: '登记机关' },
    { colKey: 'createTime', title: '创建时间' },
    { colKey: 'actions', title: '操作', width: 240 }
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
    const query = ref<ListQueryParams>({
                    femaleName: '',
                    femaleIdcard: '',
                    maleName: '',
                    maleIdcard: '',
                    registerDate: [],
                    maritalStatus: '',
                    registerAuthority: '',
                    createTime: [],
        pageNo: 1,
        pageSize: 10,
    })

    const { data, pending, execute } = useRequest(() => getMarryInfoList(query.value), {
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
        await deleteMarryInfo(id)
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
