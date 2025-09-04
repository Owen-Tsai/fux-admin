import request from '@/utils/request'

export type IPManagementVO = {
  id?: number
  ipAddress?: string
  createTime?: number
  abnormalType?: number
  abnormalDetail?: string
  accessTime?: number
  accessResource?: string
  handlingStatus?: number
}

export type ListQueryParams = CommonQueryParams & {
  accessTime?: string[]
  ipAddress?: string
  abnormalType?: number
  accessResource?: string
  handlingStatus?: number
}

const prefix = '/system/ip-management'

export const getList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<IPManagementVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const getDetail = (id: number) => {
  return request.get<IPManagementVO>({
    url: `${prefix}?id=${id}`,
  })
}

export const createIPRule = (data: IPManagementVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateIPRule = (data: IPManagementVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deleteIPRule = (id: number) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}

export const exportExcel = (params?: ListQueryParams) => {
  return request.download({
    url: `${prefix}/export`,
    params,
    filename: '异常IP管理',
  })
}
