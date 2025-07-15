import request from '@/utils/request'

export type ListQueryParams = CommonQueryParams & {
  title?: string
  infotype?: number
}

export type InformationVO = {
  id?: string
  title?: string
  sort?: number
  isTop?: boolean
  infotype?: string
  content?: string
}

export type InformationAuditVO = {
  id?: string
  auditstate?: number
  review?: string
}

const prefix = '/admin-api/info'

export const getList = (params: ListQueryParams) => {
  return request.get({
    url: `${prefix}/get-info-audit-list`,
    params,
  })
}

export const getInformationDetail = (id: string) => {
  return request.get({
    url: `${prefix}/get-information-detail?id=${id}`,
  })
}

export const getInfoTyoeTree = () => {
  return request.get({
    url: `${prefix}/get-info-tyoe-tree`,
  })
}

export const auditInformation = (data: InformationAuditVO) => {
  return request.put({
    url: `${prefix}/audit`,
    data,
  })
}
