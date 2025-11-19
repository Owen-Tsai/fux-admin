import request from '@/utils/request'

// 人才落户信息 VO
export type TalentSettleVO = {
    id?: string // 主键ID
    name?: string // 姓名
    idcard?: string // 身份证号码
    diploma?: number // 学历
    countyCode?: string // 所在区县
    streetCode?: string // 所在街道
    address?: string // 落户地址
    reason?: string // 落户原因
    settlementTime?: Date // 落户时间
}

const prefix = '/applications/talent-settle'

export type ListQueryParams = CommonQueryParams & Partial<TalentSettleVO>

// 查询人才落户信息分页
export const getTalentSettleList = (params: ListQueryParams) => {
    return request.get<PaginatedList<TalentSettleVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getTalentSettleDetail = (id: number) => {
    return request.get<TalentSettleVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addTalentSettle = (data: TalentSettleVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateTalentSettle = (data: TalentSettleVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteTalentSettle = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportTalentSettle = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '人才落户信息表.xlsx'
    })
}

