import request from '@/utils/request'

// 主页飘窗配置 VO
export type ConfigFloatVO = {
    id?: string // 主键ID
    windowTitle?: string // 飘窗标题
    windowContent?: string // 飘窗内容
    customWidth?: number // 自定义宽度（px）
    customHeight?: number // 自定义高度（px）
    bgColor?: string // 背景颜色
    textColor?: string // 文本颜色
    borderRadius?: number // 圆角大小（px）
    opacity?: number // 透明度
    clickUrl?: string // 点击跳转地址
}

const prefix = '/system/config-float'

export type ListQueryParams = CommonQueryParams & Partial<ConfigFloatVO>

// 查询主页飘窗配置分页
export const getConfigFloatList = (params: ListQueryParams) => {
    return request.get<PaginatedList<ConfigFloatVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getConfigFloatDetail = (id: number) => {
    return request.get<ConfigFloatVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addConfigFloat = (data: ConfigFloatVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateConfigFloat = (data: ConfigFloatVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteConfigFloat = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportConfigFloat = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '主页飘窗配置表'
    })
}

