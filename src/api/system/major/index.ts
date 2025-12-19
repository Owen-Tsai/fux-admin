import request from '@/utils/request'

export type MajorVO = {
  id?: string
  key?: string
  name?: string
  pname?: string
  code?: string
  pid?: string
  sort?: number
}

export type MajorTreeVO = MajorVO[]

const prefix = '/system/major'

export const getMajorTree = () => {
  return request.get<MajorTreeVO>({
    url: `${prefix}/tree-list-all`,
  })
}

export const getMajor = (id: string) => {
  return request.get<MajorVO>({
    url: `${prefix}/get`,
    params: {
      id: id,
    },
  })
}

export const addMajor = (data: MajorVO) => {
  return request.post<string>({
    url: `${prefix}/create`,
    data,
  })
}

export const deleteMajor = (id: string) => {
  return request.delete({
    url: `${prefix}/delete`,
    params: {
      id,
    },
  })
}

export const updateMajor = (data: MajorVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}
