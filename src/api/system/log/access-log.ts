import request from '@/utils/request'

export type AccessLogVO = {
  id: number
  traceId: string
  userId: number
  userType: number
  applicationName: string
  requestMethod: string
  requestParams: string
  responseBody: string
  requestUrl: string
  userIp: string
  userAgent: string
  operateModule: string
  operateName: string
  operateType: number
  duration: number
  resultCode: number
  resultMsg: string
  beginTime: number
  endTime: number
  createTime: number
}

export type ListQueryParams = CommonQueryParams & {
  userId?: number
  applicationName?: string
  requestMethod?: string
  resultCode?: string
  requestUrl?: string
  beginTime?: number[]
}

const prefix = '/infra/api-access-log'

export const getList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<AccessLogVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const exportLog = (params?: ListQueryParams) => {
  return request.download({
    url: `${prefix}/export-excel`,
    params,
    filename: '访问日志.xlsx',
  })
}
