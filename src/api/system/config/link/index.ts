import request from '@/utils/request'

// 友情链接配置 VO
export type ConfigLinkVO = {
    id?: string // 主键ID
    linkName?: string // 链接名称
    linkUrl?: string // 链接地址
    linkLogo?: string // 链接Logo地址
    linkDesc?: string // 链接描述
    orderNum?: number // 排序序号
    openType?: string // 打开方式（blank-新窗口，self-当前窗口）
}

const prefix = '/system/config-link'

export type ListQueryParams = CommonQueryParams & Partial<ConfigLinkVO>

// 查询友情链接配置分页
export const getConfigLinkList = (params: ListQueryParams) => {
    return request.get<PaginatedList<ConfigLinkVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getConfigLinkDetail = (id: number) => {
    return request.get<ConfigLinkVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addConfigLink = (data: ConfigLinkVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateConfigLink = (data: ConfigLinkVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteConfigLink = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportConfigLink = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '友情链接配置表'
    })
}

