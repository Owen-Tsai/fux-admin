import request from '@/utils/request'

export type IPTrafficVO = {
  id?: string
  ipAddress?: string
  inboundTraffic?: number
  outboundTraffic?: number
  trafficTime?: number
  accessFrequency?: number // Mbps
  createTime?: number
}

export type ListQueryParams = CommonQueryParams & {
  trafficTime?: number[]
  ipAddress?: string
}

const prefix = '/system/ip-traffic'

export const getTrafficList = (params: ListQueryParams) => {
  return request.get<PaginatedList<IPTrafficVO>>({
    url: `${prefix}/page`,
    params: params,
  })
}

export const getDetail = (id: string) => {
  return request.get<IPTrafficVO>({
    url: `${prefix}/get`,
    params: { id },
  })
}

export const deleteTraffic = (id: string) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}

export const exportTraffic = (params?: ListQueryParams) => {
  return request.download({
    url: `${prefix}/export-excel`,
    params: params,
    filename: 'IP流量监控',
  })
}
