import request from '@/utils/request'

// 媒体报道信息 VO
export type MediaVO = {
    id?: string // 主键ID
    title?: string // 报道标题
    summary?: string // 报道摘要
    content?: string // 报道文字内容
    mediaName?: string // 媒体名称
    mediaSource?: string // 报道来源
    reportTime?: Date // 报道日期
    publishMediaType?: number // 存储类型
    sortNum?: number // 排序字段
}

const prefix = '/applications/media'

export type ListQueryParams = CommonQueryParams & Partial<MediaVO>

// 查询媒体报道信息分页
export const getMediaList = (params: ListQueryParams) => {
    return request.get<PaginatedList<MediaVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getMediaDetail = (id: number) => {
    return request.get<MediaVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addMedia = (data: MediaVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateMedia = (data: MediaVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteMedia = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportMedia = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '媒体报道信息表'
    })
}

