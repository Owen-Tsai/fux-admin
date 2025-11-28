import request from '@/utils/request'

// 社保个人缴存信息 VO
export type SocialInfoVO = {
    id?: string // 主键ID
    unitSocialCode?: string // 单位编号
    unitName?: string // 单位名称
    personalNo?: string // 个人编号
    name?: string // 姓名
    payYearmonth?: Date // 缴费年月
    payStatus?: string // 缴费状态
}

const prefix = '/applications/social-info'

export type ListQueryParams = CommonQueryParams & Partial<SocialInfoVO>

// 查询社保个人缴存信息分页
export const getSocialInfoList = (params: ListQueryParams) => {
    return request.get<PaginatedList<SocialInfoVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getSocialInfoDetail = (id: number) => {
    return request.get<SocialInfoVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addSocialInfo = (data: SocialInfoVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateSocialInfo = (data: SocialInfoVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteSocialInfo = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportSocialInfo = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '社保个人缴存信息'
    })
}

