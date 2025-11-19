import { getConfigLinkList,deleteConfigLink, type ListQueryParams } from '@/api/system/config/link'
import type { TableProps,FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
    { colKey: 'linkName', title: '链接名称' },
    { colKey: 'linkUrl', title: '链接地址' },
    { colKey: 'linkLogo', title: '链接Logo地址' },
    { colKey: 'linkDesc', title: '链接描述' },
    { colKey: 'orderNum', title: '排序序号' },
    { colKey: 'openType', title: '打开方式（blank-新窗口，self-当前窗口）' },
    { colKey: 'createTime', title: '创建时间' },
    { colKey: 'actions', title: '操作', width: 240 }
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
    const query = ref<ListQueryParams>({
                    linkName: '',
                    linkUrl: '',
                    linkLogo: '',
                    linkDesc: '',
                    orderNum: '',
                    openType: '',
                    createTime: [],
        pageNo: 1,
        pageSize: 10,
    })

    const { data, pending, execute } = useRequest(() => getConfigLinkList(query.value), {
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
        await deleteConfigLink(id)
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
