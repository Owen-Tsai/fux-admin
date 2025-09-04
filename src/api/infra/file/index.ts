import request from '@/utils/request'

export type ListQueryParams = CommonQueryParams & {
  path?: string
  type?: string
}

export type FileVO = {
  id?: number
  configId?: number // file-config id
  path?: string
  type?: string
  name?: string
  url?: string // fullpath
  size?: number
  createTime?: number
}

export type FilePresignedRespVO = {
  configId: number
  uploadUrl: string
  url: string
}

export type FileUploadVO = {
  file: File
}

const prefix = '/infra/file'

export const getFileList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<FileVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const createFile = (data: FileVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const uploadFile = (data: FileUploadVO) => {
  return request.upload({
    url: `${prefix}/upload`,
    data,
  })
}

export const deleteFile = (id?: number) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}

// 获取文件预签名地址
export const getFilePresignedUrl = (path: string) => {
  return request.get<FilePresignedRespVO>({
    url: `${prefix}/presigned-url`,
    params: {
      path,
    },
  })
}
