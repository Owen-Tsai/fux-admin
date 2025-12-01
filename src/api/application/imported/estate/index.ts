import request from '@/utils/request'

// 不动产登记信息 VO
export type EstateInfoVO = {
    id?: string // 主键ID
    certNo?: string // 不动产权证号
    unitNo?: string // 不动产单元号
    ownershipStatus?: string // 权属状态
    location?: string // 坐落
    buildingArea?: string // 建筑面积
    floor?: string // 所在层
    totalFloors?: string // 总层数
    completionTime?: Date // 竣工时间
}

const prefix = '/applications/estate-info'

export type ListQueryParams = CommonQueryParams & Partial<EstateInfoVO>

// 查询不动产登记信息分页
export const getEstateInfoList = (params: ListQueryParams) => {
    return request.get<PaginatedList<EstateInfoVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getEstateInfoDetail = (id: number) => {
    return request.get<EstateInfoVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addEstateInfo = (data: EstateInfoVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateEstateInfo = (data: EstateInfoVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteEstateInfo = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportEstateInfo = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '不动产登记信息表'
    })
}

