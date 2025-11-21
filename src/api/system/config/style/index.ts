import request from '@/utils/request'

// 系统样式配置 VO
export type ConfigStyleVO = {
    id?: string // 主键ID
    primaryColor?: string // 主色调
    backgroundColor?: string // 背景色
    textColor?: string // 文本主色
}

const prefix = '/system/config-style'

export type ListQueryParams = CommonQueryParams & Partial<ConfigStyleVO>

// 查询系统样式配置分页
export const getConfigStyleList = (params: ListQueryParams) => {
    return request.get<PaginatedList<ConfigStyleVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getConfigStyleDetail = (id: number) => {
    return request.get<ConfigStyleVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addConfigStyle = (data: ConfigStyleVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateConfigStyle = (data: ConfigStyleVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteConfigStyle = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportConfigStyle = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '系统样式配置表'
    })
}

