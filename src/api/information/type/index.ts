import request from '@/utils/request'

export type TypeQueryParams = {
  name?: string
}

export type InformationTypeVO = {
  id?: string
  name?: string
  parentId?: string
  sort?: number
  isInMobile?: boolean
  isAudit?: boolean
  status?: number
  creator?: string
  createTime?: string
  updater?: string
  updateTime?: string
}

export type InformationTypeAuditVO = {
  id?: string
  isAudit?: boolean
}

const prefix = '/admin-api/system/type'

export const getTypeTree = (params: TypeQueryParams) => {
  return request.get({
    url: `${prefix}/get-type-tree-list`,
    params,
  })
}

export const getInfoTypeDetail = (id: string) => {
  return request.get({
    url: `${prefix}/get-info-type?id=${id}`,
  })
}

export const createInfoType = (data: InformationTypeVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateInfoType = (data: InformationTypeVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const updateInfoTypeAudit = (data: InformationTypeAuditVO) => {
  return request.put({
    url: `${prefix}/update-audit`,
    data,
  })
}

export const deleteType = (id: string) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}
