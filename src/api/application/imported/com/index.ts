import request from '@/utils/request'

// 企业基本信息 VO
export type ComInfoVO = {
    id?: string // 主键ID
    name?: string // 企业名称
    enterpriseType?: string // 企业类型
    establishDate?: Date // 成立日期
    legalRep?: string // 法定代表人
    domicile?: string // 住所
    approveDate?: Date // 核准日期
    businessTermStart?: Date // 经营期限自
    businessTermEnd?: Date // 经营期限至
    businessScope?: string // 经营范围
    registeredCapital?: string // 注册资本
    currency?: string // 注册资本币种
    registrationNo?: string // 注册号
    creditCode?: string // 统一社会信用代码
    registrationAuth?: string // 登记机关
    registrationStatus?: string // 登记状态
    nodeNo?: string // 节点号
}

const prefix = '/applications/com-info'

export type ListQueryParams = CommonQueryParams & Partial<ComInfoVO>

// 查询企业基本信息分页
export const getComInfoList = (params: ListQueryParams) => {
    return request.get<PaginatedList<ComInfoVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getComInfoDetail = (id: number) => {
    return request.get<ComInfoVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addComInfo = (data: ComInfoVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateComInfo = (data: ComInfoVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteComInfo = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportComInfo = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '企业基本信息'
    })
}

