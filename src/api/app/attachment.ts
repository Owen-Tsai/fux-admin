import request from '@/utils/request'

export type AttachmentTypeVO = {
  id?: string
  name?: string
  allowedFileTypes?: string[]
  maxFileSize?: number
  moduleName?: string
  required?: boolean
  isLib?: boolean
  libType?: string
  createTime?: string
}

export type ListQueryParams = {
  name?: string
  moduleName?: string
} & CommonQueryParams

const prefix = '/attach/type'

export const getAttachmentTypesList = (params?: ListQueryParams) => {
  return request.get<PaginatedList<AttachmentTypeVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const createAttachmentType = (data: AttachmentTypeVO) => {
  const size = data.maxFileSize ? data.maxFileSize * 1024 * 1024 : undefined

  return request.post({
    url: `${prefix}/create`,
    data: {
      ...data,
      maxFileSize: size,
    },
  })
}

export const updateAttachmentType = (data: AttachmentTypeVO) => {
  const size = data.maxFileSize ? data.maxFileSize * 1024 * 1024 : undefined

  return request.put({
    url: `${prefix}/update`,
    data: {
      ...data,
      maxFileSize: size,
    },
  })
}

export const deleteAttachmentType = (id: string) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}

export const getAttachmentTypeDetail = async (id: string) => {
  const res = await request.get<AttachmentTypeVO>({
    url: `${prefix}/get?id=${id}`,
  })

  if (res.maxFileSize) {
    res.maxFileSize = res.maxFileSize / 1024 / 1024
  }

  return res
}

export const getAttachmentTypeSimpleList = () => {
  return request.get<AttachmentTypeVO[]>({
    url: `${prefix}/list-all-simple`,
  })
}
