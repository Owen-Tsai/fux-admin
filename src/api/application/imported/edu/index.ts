import request from '@/utils/request'

// 高等教育学历信息 VO
export type EduInfoVO = {
    id?: string // 主键ID
    name?: string // 姓名
    diploma?: string // 学历
    graduateSchool?: string // 毕业学校
    graduateTime?: Date // 毕业时间
    major?: string // 专业名称
    studyType?: number // 学习形式
    startTime?: Date // 入学时间
    certNo?: string // 证书编号
}

const prefix = '/applications/edu-info'

export type ListQueryParams = CommonQueryParams & Partial<EduInfoVO>

// 查询高等教育学历信息分页
export const getEduInfoList = (params: ListQueryParams) => {
    return request.get<PaginatedList<EduInfoVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getEduInfoDetail = (id: number) => {
    return request.get<EduInfoVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addEduInfo = (data: EduInfoVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateEduInfo = (data: EduInfoVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteEduInfo = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportEduInfo = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '高等教育学历信息'
    })
}

