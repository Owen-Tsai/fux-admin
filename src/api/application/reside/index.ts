import request from '@/utils/request'

// 居住证核发信息 VO
export type ResideCardVO = {
    id?: string // 主键ID
    name?: string // 姓名
    idcard?: string // 身份证号码
    registeredAddress?: string // 户籍地
    currentAddress?: string // 现居住地
    issueTime?: Date // 核发时间
}

const prefix = '/applications/reside-card'

export type ListQueryParams = CommonQueryParams & Partial<ResideCardVO>

// 查询居住证核发信息分页
export const getResideCardList = (params: ListQueryParams) => {
    return request.get<PaginatedList<ResideCardVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getResideCardDetail = (id: number) => {
    return request.get<ResideCardVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addResideCard = (data: ResideCardVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateResideCard = (data: ResideCardVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteResideCard = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportResideCard = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '居住证核发信息表'
    })
}

