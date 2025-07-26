import request from '@/utils/request'

export type TreeQueryParams = {
  name?: string
}

export type InfoTypeVO = {
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

export type InfoTypeTreeVO = InfoTypeVO &
  {
    children?: InfoTypeTreeVO[]
  }[]

const prefix = '/information/type'

export const getInfoTypeTree = (params: TreeQueryParams) => {
  return request.get<InfoTypeTreeVO>({
    url: `${prefix}/tree-list`,
    params,
  })
}

export const createInfoType = (data: InfoTypeVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateInfoType = (data: InfoTypeVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deleteInfoType = (id: string) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}

export const getInfoTypeDetail = (id: string) => {
  return request.get<InfoTypeVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const updateInfoTypeAudit = (id: string, isAudit: boolean) => {
  return request.put({
    url: `${prefix}/update-audit`,
    data: {
      id,
      isAudit,
    },
  })
}
