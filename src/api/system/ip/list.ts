import request from '@/utils/request'

export type IPListEntryVO = {
  id?: string
  ipAddress?: string
  description?: string
  /**
   * 是否为白名单
   */
  listType?: boolean
  createTime?: number
}

export type ListQueryParams = CommonQueryParams & {
  listType?: boolean
  createTime?: number[]
  ipAddress?: string
}

const prefix = '/system/ip-list'

// 查询IP白名单和黑名单分页
export const getList = (params: ListQueryParams) => {
  return request.get<PaginatedList<IPListEntryVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const getDetail = (id: number) => {
  return request.get<IPListEntryVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const createIPListEntry = (data: IPListEntryVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateIPListEntry = (data: IPListEntryVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deleteIPListEntry = (id: string) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}

export const exportIPList = (params?: ListQueryParams) => {
  return request.download({
    url: `${prefix}/export-excel`,
    params: params,
    filename: 'IP白名单和黑名单',
  })
}
