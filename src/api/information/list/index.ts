import request from '@/utils/request'

export type ListQueryParams = CommonQueryParams & {
  title?: string
  infotype?: number
}

export type InformationVO = {
  id?: string
  title?: string
  herfurl?: string
  imageinfo?: string
  attachment?: Array<string>
  sort?: number
  isTop?: boolean
  isHome?: boolean
  infotype?: string
  content?: string
  senddate?: string
}

const prefix = '/admin-api/info'

export const getList = (params: ListQueryParams) => {
  return request.get({
    url: `${prefix}/get-info-list`,
    params,
  })
}

export const deleteInformation = (id: string) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
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

export const addInformation = (data: InformationVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateInformation = (data: InformationVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}
