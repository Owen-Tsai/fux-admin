import request from '@/utils/request'

// 洛阳风采信息 VO
export type SceneryVO = {
    id?: string // 主键ID
    sceneryType?: number // 分类
    title?: string // 宣传标题
    summary?: string // 内容摘要
    content?: string // 详细文字内容
    sortNum?: number // 排序字段
}

const prefix = '/applications/scenery'

export type ListQueryParams = CommonQueryParams & Partial<SceneryVO>

// 查询洛阳风采信息分页
export const getSceneryList = (params: ListQueryParams) => {
    return request.get<PaginatedList<SceneryVO>>({
        url: `${prefix}/page`,
        params
    })
}

export const getSceneryDetail = (id: number) => {
    return request.get<SceneryVO>({
        url: `${prefix}/get?id=${id}`
    })
}

export const addScenery = (data: SceneryVO) => {
    return request.post({
        url: `${prefix}/create`,
        data
    })
}

export const updateScenery = (data: SceneryVO) => {
    return request.put({
        url: `${prefix}/update`,
        data
    })
}

export const deleteScenery = (id: number) => {
    return request.delete({
        url: `${prefix}/delete?id=${id}`
    })
}

export const exportScenery = (params?: ListQueryParams) => {
    return request.download({
        url: `${prefix}/export-excel`,
        params: params,
        filename: '洛阳风采信息表'
    })
}

