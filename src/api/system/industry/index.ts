import request from '@/utils/request'

export type IndustryVO = {
  id?: string
  name?: string
  pid?: string
  pname?: string
  sort?: number
  code?: string
}

export type IndustryTreeVO = IndustryVO[]

const prefix = '/system/trade'

export const getIndustryTree = () => {
  return request.get<IndustryTreeVO>({
    url: `${prefix}/tree-list-all`,
  })
}

export const getIndustry = (id: string) => {
  return request.get<IndustryVO>({
    url: `${prefix}/get`,
    params: {
      id: id,
    },
  })
}

export const addIndustry = (data: IndustryVO) => {
  return request.post<string>({
    url: `${prefix}/create`,
    data,
  })
}

export const deleteIndustry = (id: string) => {
  return request.delete({
    url: `${prefix}/delete`,
    params: {
      id,
    },
  })
}

export const updateIndustry = (data: IndustryVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}
