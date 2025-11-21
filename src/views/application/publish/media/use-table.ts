import { getMediaList,deleteMedia, type ListQueryParams } from '@/api/application/publish/media'
import type { TableProps,FormInstanceFunctions } from 'tdesign-vue-next'

export const columns: TableProps['columns'] = [
    { colKey: 'title', title: '报道标题' },
    { colKey: 'summary', title: '报道摘要' , ellipsis: true},
    // { colKey: 'content', title: '报道文字内容' },
    { colKey: 'mediaName', title: '媒体名称' },
    { colKey: 'mediaSource', title: '报道来源' },
    { colKey: 'reportTime', title: '报道日期' },
    { colKey: 'publishMediaType', title: '存储类型' },
    { colKey: 'sortNum', title: '排序字段' },
    // { colKey: 'viewCount', title: '播放量' },
    // { colKey: 'likeCount', title: '点赞数' },
    // { colKey: 'createTime', title: '创建时间' },
    { colKey: 'actions', title: '操作', width: 240 }
]
export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
    const query = ref<ListQueryParams>({
                    title: '',
                    summary: '',
                    content: '',
                    mediaName: '',
                    mediaSource: '',
                    reportTime: [],
                    publishMediaType: '',
                    sortNum: '',
                    viewCount: '',
                    likeCount: '',
                    createTime: [],
        pageNo: 1,
        pageSize: 10,
    })

    const { data, pending, execute } = useRequest(() => getMediaList(query.value), {
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
        await deleteMedia(id)
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
