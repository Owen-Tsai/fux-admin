import request from '@/utils/request'
export type UnitTreeNode = {
  key: number
  title: string
  children?: UnitTreeNode[]
}

export type UnitTreeVO = UnitTreeNode[]
// 单位 VO
export type UnitVO = {
    id?: number // 单位ID
    name?: string // 单位名称
    code?: string // 单位编码
    shortName?: string // 单位简称
    address?: string // 地址
    parentId?: number // 父单位ID
    sort?: number // 显示顺序
    status?: number // 单位状态(0=正常 1=停用)
}
export type TreeQueryParams = {
  name?: string
  status?: number
  leaderUserId?: number
}
const prefix = '/system/unit'

export type ListQueryParams = CommonQueryParams & Partial<UnitVO>

export const getUnitTree = (params?: TreeQueryParams) => {
  return request.get<UnitTreeVO>({
    url: `${prefix}/tree-list`,
    params,
  })
}
// 查询单位分页
export const getUnitList = (params: ListQueryParams) => {
    return request.get<PaginatedList<UnitVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getUnitDetail = (id: number) => {
    return request.get<UnitVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addUnit = (data: UnitVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateUnit = (data: UnitVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteUnit = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportUnit = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '单位表'
    })
}

