import request from '@/utils/request'

export type AreaVO = {
  name?: string
  code?: string
  id?: string
  pid?: string
  pname?: string
  sort?: number
}

export type AreaTreeVO = AreaVO[]

const prefix = '/system/area'

export const getAreaTree = () => {
  return request.get<AreaTreeVO>({
    url: `${prefix}/tree-list-all`,
  })
}

export const getAreaDetail = (id: string) => {
  return request.get<AreaVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const addArea = (data: AreaVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateArea = (data: AreaVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deleteArea = (id: string) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}
