import request from '@/utils/request'

// 河洛青年创新创业人才 VO
export type YouthCreateVO = {
    id?: string // 主键ID
    idcard?: string // 身份证号
    name?: string // 姓名
    birthday?: Date // 出生年月
    diploma?: number // 学历
    professionalTitle?: number // 职称
    workUnit?: string // 工作单位
    techField?: number // 技术领域
    talentTitle?: number // 人才称号
    supportFund?: number // 支持资金
    selectionYear?: number // 入选年度
    county?: number // 所在县区
    contact?: string // 本人联系方式
    projectResult?: number // 项目验收结果
}

const prefix = '/applications/youth-create'

export type ListQueryParams = CommonQueryParams & Partial<YouthCreateVO>

// 查询河洛青年创新创业人才分页
export const getYouthCreateList = (params: ListQueryParams) => {
    return request.get<PaginatedList<YouthCreateVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getYouthCreateDetail = (id: number) => {
    return request.get<YouthCreateVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addYouthCreate = (data: YouthCreateVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateYouthCreate = (data: YouthCreateVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteYouthCreate = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportYouthCreate = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '河洛青年创新创业人才表.xlsx'
    })
}

