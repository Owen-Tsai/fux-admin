import { getConfigFontList,deleteConfigFont, type ListQueryParams } from '@/api/system/config/font'
import type { TableProps,FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
    { colKey: 'fontFamily', title: '字体家族' },
    { colKey: 'fontSizeTitle', title: '标题字体大小（px）' },
    { colKey: 'fontSizeContent', title: '内容字体大小（px）' },
    { colKey: 'fontWeightTitle', title: '标题字重' },
    { colKey: 'fontWeightBase', title: '内容字重' },
    { colKey: 'createTime', title: '创建时间' },
    { colKey: 'actions', title: '操作', width: 240 }
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
    const query = ref<ListQueryParams>({
                    fontFamily: '',
                    fontSizeTitle: '',
                    fontSizeContent: '',
                    fontWeightTitle: '',
                    fontWeightBase: '',
                    createTime: [],
        pageNo: 1,
        pageSize: 10,
    })

    const { data, pending, execute } = useRequest(() => getConfigFontList(query.value), {
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
        await deleteConfigFont(id)
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
