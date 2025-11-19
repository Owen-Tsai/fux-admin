import request from '@/utils/request'

// 系统基础配置 VO
export type ConfigBaseVO = {
    id?: string // 主键ID
    systemName?: string // 系统名称
    systemDesc?: string // 系统描述
    systemVersion?: string // 系统版本
    copyright?: string // 版权信息
}

const prefix = '/system/config-base'

export type ListQueryParams = CommonQueryParams & Partial<ConfigBaseVO>

// 查询系统基础配置分页
export const getConfigBaseList = (params: ListQueryParams) => {
    return request.get<PaginatedList<ConfigBaseVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getConfigBaseDetail = (id: number) => {
    return request.get<ConfigBaseVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addConfigBase = (data: ConfigBaseVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateConfigBase = (data: ConfigBaseVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteConfigBase = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportConfigBase = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '系统基础配置表'
    })
}

