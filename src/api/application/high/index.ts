import request from '@/utils/request'

// 河洛高层次创新创业人才(团队) VO
export type HighCreateGroupVO = {
    id?: string // 主键ID
    idcard?: string // 身份证号
    companyName?: string // 企业名称
    projectName?: string // 项目名称
    teamLeader?: string // 团队带头人
    industryType?: number // 产业类别
    investmentAmount?: number // 投资金额
    landingCounty?: number // 落地县区
    contactPerson?: string // 联系人
}

const prefix = '/applications/high-create-group'

export type ListQueryParams = CommonQueryParams & Partial<HighCreateGroupVO>

// 查询河洛高层次创新创业人才(团队)分页
export const getHighCreateGroupList = (params: ListQueryParams) => {
    return request.get<PaginatedList<HighCreateGroupVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getHighCreateGroupDetail = (id: number) => {
    return request.get<HighCreateGroupVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addHighCreateGroup = (data: HighCreateGroupVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateHighCreateGroup = (data: HighCreateGroupVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteHighCreateGroup = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportHighCreateGroup = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '河洛高层次创新创业人才(团队).xlsx'
    })
}

