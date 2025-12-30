import request from '@/utils/request'

type ExportQueryParams = {
  appId?: string
}

export const exportComApplyExcel = (fileName: string, params?: ExportQueryParams) => {
  return request.download({
    url: '/com-apply/export-excel',
    params,
    filename: fileName,
  })
}
