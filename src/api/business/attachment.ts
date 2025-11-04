import request from '@/utils/request'

export type UploadList = Array<{
  id: string
  name: string
  required: boolean
  maxFileSize: number
  allowedFileTypes: string
  attachDO: Record<string, unknown>
}>

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
