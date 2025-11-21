import { getSceneryList,deleteScenery, type ListQueryParams } from '@/api/application/publish/scenery'
import type { TableProps,FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
  { colKey: 'title', title: '宣传标题'},
  { colKey: 'sceneryType', title: '分类' },
    { colKey: 'summary', title: '内容摘要', ellipsis: true },
    // { colKey: 'content', title: '详细文字内容' },
    { colKey: 'sceneryStatus', title: '状态' },
    { colKey: 'sortNum', title: '排序字段' },
    // { colKey: 'viewCount', title: '浏览量' },
    // { colKey: 'likeCount', title: '点赞数' },
    { colKey: 'createTime', title: '创建时间' },
    { colKey: 'actions', title: '操作', width: 240 }
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
    const query = ref<ListQueryParams>({
                    sceneryType: '',
                    title: '',
                    summary: '',
                    content: '',
                    sceneryStatus: '',
                    sortNum: '',
                    viewCount: '',
                    likeCount: '',
                    createTime: [],
        pageNo: 1,
        pageSize: 10,
    })

    const { data, pending, execute } = useRequest(() => getSceneryList(query.value), {
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
        await deleteScenery(id)
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
