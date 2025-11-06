import request from '@/utils/request'

// 网上服务大厅事项 VO
export type HallItemsVO = {
    id?: string // 主键ID
    itemName?: string // 事项名称
    department?: string // 所属业务职能部门
    description?: string // 事项描述
    linkUrl?: string // 事项入口链接
    iconPath?: string // 事项图标路径
    sortOrder?: number // 排序
    status?: number // 状态（1-上架，0-下架）
    isHot?: boolean // 是否热门（1-是，0-否）
}

const prefix = '/application/hall-items'

export type ListQueryParams = CommonQueryParams & Partial<HallItemsVO>

// 查询网上服务大厅事项分页
export const getHallItemsList = (params: ListQueryParams) => {
    return request.get<PaginatedList<HallItemsVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getHallItemsDetail = (id: number) => {
    return request.get<HallItemsVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addHallItems = (data: HallItemsVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateHallItems = (data: HallItemsVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteHallItems = (id: string) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportHallItems = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '网上服务大厅事项表'
    })
}

export const setPublishedStatus = (data: HallItemsVO) => {
  return request.put({
    url: `${prefix}/update-published-status`,
    data: data,
  })
}

export const setHotStatus = (data: HallItemsVO) => {
  return request.put({
    url: `${prefix}/update-hot-status`,
    data: data,
  })
}

