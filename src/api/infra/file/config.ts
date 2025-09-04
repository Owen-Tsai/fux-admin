import request from '@/utils/request'

export type ListQueryParams = CommonQueryParams & {
  name?: string
  storage?: number
}

export type FileClientConfig = {
  basePath?: string
  host?: string
  port?: number
  username?: string
  password?: string
  mode?: string
  endpoint?: string
  bucket?: string
  accessKey?: string
  accessSecret?: string
  domain?: string
}

export type FileConfigVO = {
  id?: number
  name?: string
  storage?: number
  master?: boolean
  visible?: boolean
  config?: FileClientConfig
  remark?: string
  createTime?: string
}

const prefix = '/infra/file-config'

export const getConfigList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<FileConfigVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const getConfigDetail = (id: number) => {
  return request.get<FileConfigVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const createConfig = (data: FileConfigVO) => {
  return request.post<FileConfigVO>({
    url: `${prefix}/create`,
    data,
  })
}

export const updateConfig = (data: FileConfigVO) => {
  return request.put<FileConfigVO>({
    url: `${prefix}/update`,
    data,
  })
}

export const deleteConfig = (id: number) => {
  return request.delete<FileConfigVO>({
    url: `${prefix}/delete?id=${id}`,
  })
}

export const testConfig = (id: number) => {
  return request.get<string>({
    url: `${prefix}/test?id=${id}`,
  })
}

export const setMaster = (id: number) => {
  return request.put<FileConfigVO>({
    url: `${prefix}/update-master?id=${id}`,
  })
}
