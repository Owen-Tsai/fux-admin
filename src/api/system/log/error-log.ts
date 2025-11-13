import request from '@/utils/request'

export type ErrorLogVO = {
  id?: number
  traceId?: string
  userId?: number
  userType?: number
  applicationName?: string
  requestMethod?: string
  requestParams?: string
  requestUrl?: string
  userIp?: string
  userAgent?: string
  exceptionTime?: Date
  exceptionName?: string
  exceptionMessage?: string
  exceptionRootCauseMessage?: string
  exceptionStackTrace?: string
  exceptionClassName?: string
  exceptionFileName?: string
  exceptionMethodName?: string
  exceptionLineNumber?: number
  processUserId?: number
  processStatus?: number
  processTime?: Date
  resultCode?: number
  createTime?: Date
}

export type ListQueryParams = CommonQueryParams & {
  userId?: number
  applicationName?: string
  requestMethod?: string
  requestUrl?: string
  processStatus?: number
  exceptionTime?: string[]
}

const prefix = '/infra/api-error-log'

export const getErrorLogPage = (params?: ListQueryParams) => {
  return request.get<PaginatedList<ErrorLogVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const exportLog = (params?: ListQueryParams) => {
  return request.download({
    url: `${prefix}/export-excel`,
    params,
    filename: '异常日志.xlsx',
  })
}

export const setProcessStatus = (id: number, status: number) => {
  return request.put({
    url: `${prefix}/update-status`,
    params: {
      id,
      processStatus: status,
    },
  })
}
