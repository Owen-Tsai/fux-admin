import request from '@/utils/request'

export type ListQueryParams = CommonQueryParams & {
  title?: string
  infoType?: string
  isPinned?: boolean
  isInHome?: boolean
  publishTime?: string[]
}

export type InformationVO = {
  id?: number
  title?: string
  infoType?: string
  content?: string
  attachment?: string[]
  isPinned?: boolean
  isInHome?: boolean
  publishTime?: string
  createTime?: string
  hrefUrl?: string
  image?: string
  sort?: number
}

const prefix = `/information/info`

export const getInfoList = (params: ListQueryParams) => {
  return request.get<PaginatedList<InformationVO>>({
    url: `${prefix}/list`,
    params,
  })
}

export const getInfoDetail = (id: string) => {
  return request.get<InformationVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const createInfo = (data: InformationVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateInfo = (data: InformationVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deleteInfo = (id: string) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}
