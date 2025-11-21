import request from '@/utils/request'

// 系统字体配置 VO
export type ConfigFontVO = {
    id?: string // 主键ID
    fontFamily?: string // 字体家族
    fontSizeTitle?: number // 标题字体大小（px）
    fontSizeContent?: number // 内容字体大小（px）
    fontWeightTitle?: string // 标题字重
    fontWeightBase?: string // 内容字重
}

const prefix = '/system/config-font'

export type ListQueryParams = CommonQueryParams & Partial<ConfigFontVO>

// 查询系统字体配置分页
export const getConfigFontList = (params: ListQueryParams) => {
    return request.get<PaginatedList<ConfigFontVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getConfigFontDetail = (id: number) => {
    return request.get<ConfigFontVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addConfigFont = (data: ConfigFontVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateConfigFont = (data: ConfigFontVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteConfigFont = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportConfigFont = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '系统字体配置表'
    })
}

