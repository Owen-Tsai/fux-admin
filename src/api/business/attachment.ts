import request from '@/utils/request'

export type UploadList = Array<{
  id: string
  name: string
  required: boolean
  maxFileSize: number
  allowedFileTypes: string
  attachDO: AttachDO | null
}>

export type AttachDO = {
  id: string
  uploadname: string
  uploaddate: number
  generatename: string
  modeName: string
  uploadPath: string
  uploadType: string
}

export const getUploadList = (appId: string, planId: string, applyId: string) => {
  return request.get<UploadList>({
    url: '/attach/type/get-list-by-plan-id',
    params: {
      appId,
      planId,
      applyId,
    },
  })
}
