import request from '@/utils/request'

// 养老保险个人缴存信息 VO
export type InsurInfoVO = {
    id?: string // 主键ID
    idcard?: string // 身份证号
    payPeriod?: string // 缴费期别
    payBase?: string // 缴费基数
    payAmount?: string // 缴费金额
    unitNo?: string // 单位编号
    insuredAreaCode?: string // 参保地行政区划代码
    personalIdentity?: string // 个人身份
    payYearmonth?: Date // 缴费年月
}

const prefix = '/applications/insur-info'

export type ListQueryParams = CommonQueryParams & Partial<InsurInfoVO>

// 查询养老保险个人缴存信息分页
export const getInsurInfoList = (params: ListQueryParams) => {
    return request.get<PaginatedList<InsurInfoVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getInsurInfoDetail = (id: number) => {
    return request.get<InsurInfoVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addInsurInfo = (data: InsurInfoVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateInsurInfo = (data: InsurInfoVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteInsurInfo = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportInsurInfo = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '养老保险个人缴存信息'
    })
}

