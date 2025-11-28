import request from '@/utils/request'

// 婚姻登记信息 VO
export type MarryInfoVO = {
    id?: string // 主键ID
    femaleName?: string // 女方姓名
    femaleIdcard?: string // 女方身份证件号码
    maleName?: string // 男方姓名
    maleIdcard?: string // 男方身份证件号码
    registerDate?: Date // 登记日期
    maritalStatus?: string // 婚姻状况
    registerAuthority?: string // 登记机关
}

const prefix = '/applications/marry-info'

export type ListQueryParams = CommonQueryParams & Partial<MarryInfoVO>

// 查询婚姻登记信息分页
export const getMarryInfoList = (params: ListQueryParams) => {
    return request.get<PaginatedList<MarryInfoVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getMarryInfoDetail = (id: number) => {
    return request.get<MarryInfoVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addMarryInfo = (data: MarryInfoVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateMarryInfo = (data: MarryInfoVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteMarryInfo = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportMarryInfo = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '婚姻登记信息表'
    })
}

