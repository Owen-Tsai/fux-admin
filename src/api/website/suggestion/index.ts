import request from '@/utils/request'

// 投诉建议 VO
export type SuggestionVO = {
  type?: number // 类型类型1 = 投诉，2 = 建议
  name?: string // 姓名
  mobile?: string // 手机
  content?: string // 内容
  status?: number // 状态1 = 待处理，2 = 处理中，3 = 已回复，4 = 已关闭
  replyContent?: string // 回复内容
  replyTime?: Date // 回复时间
}

const prefix = '/admin-api/system/suggestion'

export type ListQueryParams = CommonQueryParams & Partial<SuggestionVO>

// 查询投诉建议分页
export const getList = (params: ListQueryParams) => {
  return request.get<PaginatedList<SuggestionVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const getDetail = (id: number) => {
  return request.get<SuggestionVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const createSuggestion = (data: SuggestionVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateSuggestion = (data: SuggestionVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deleteSuggestion = (id: number) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}

export const exportSuggestion = (params?: ListQueryParams) => {
  return request.download({
    url: `${prefix}/export-excel`,
    params: params,
    filename: '投诉建议表',
  })
}

// 回复投诉建议
export const replySuggestion = (id: string, replyContent: string) => {
  return request.post({
    url: `${prefix}/reply`,
    params: { id, replyContent },
  })
}
