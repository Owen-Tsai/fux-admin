import request from '@/utils/request'
import type { InformationVO } from './index'

export type ListQueryParams = CommonQueryParams & {
  title?: string
  infoType?: number
}

export type InformationAuditVO = {
  id?: string
  auditState?: number
  review?: string
}

const prefix = '/information/info'

export const getInfoAuditList = (params: ListQueryParams) => {
  return request.get<PaginatedList<InformationVO>>({
    url: `${prefix}/audit-list`,
    params,
  })
}

export const updateInfoAuditState = (data: InformationAuditVO) => {
  return request.put({
    url: `${prefix}/audit`,
    data,
  })
}
