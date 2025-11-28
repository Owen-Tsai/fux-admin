import { getEduInfoList,deleteEduInfo, type ListQueryParams } from '@/api/application/imported/edu'
import type { TableProps,FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
    { colKey: 'name', title: '姓名' },
    { colKey: 'diploma', title: '学历' },
    { colKey: 'graduateSchool', title: '毕业学校' },
    { colKey: 'graduateTime', title: '毕业时间' },
    { colKey: 'major', title: '专业名称' },
    { colKey: 'studyType', title: '学习形式' },
    { colKey: 'startTime', title: '入学时间' },
    { colKey: 'certNo', title: '证书编号' },
    { colKey: 'createTime', title: '创建时间' },
    { colKey: 'actions', title: '操作', width: 240 }
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
    const query = ref<ListQueryParams>({
                    name: '',
                    diploma: '',
                    graduateSchool: '',
                    graduateTime: [],
                    major: '',
                    studyType: '',
                    startTime: [],
                    certNo: '',
                    createTime: [],
        pageNo: 1,
        pageSize: 10,
    })

    const { data, pending, execute } = useRequest(() => getEduInfoList(query.value), {
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
        await deleteEduInfo(id)
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
