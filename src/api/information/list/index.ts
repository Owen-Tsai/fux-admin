import request from '@/utils/request'

export type ListQueryParams = CommonQueryParams & {
  title?: string
  infotype?: number
}

export type InformationVO = {
  id: string
  title?: string
  creator?: string
  createTime?: string
  infotype?: string
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
