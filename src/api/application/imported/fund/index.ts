import request from '@/utils/request'

// 公积金个人缴存明细 VO
export type FundInfoVO = {
    id?: string // 主键ID
    personalAccount?: string // 个人账户
    unitAccount?: string // 单位账户
    depositType?: string // 缴存类型
    payStartMonth?: string // 缴款月份起
}

const prefix = '/applications/fund-info'

export type ListQueryParams = CommonQueryParams & Partial<FundInfoVO>

// 查询公积金个人缴存明细分页
export const getFundInfoList = (params: ListQueryParams) => {
    return request.get<PaginatedList<FundInfoVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getFundInfoDetail = (id: number) => {
    return request.get<FundInfoVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addFundInfo = (data: FundInfoVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateFundInfo = (data: FundInfoVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteFundInfo = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportFundInfo = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '公积金个人缴存明细表'
    })
}

