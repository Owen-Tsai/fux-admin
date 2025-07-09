import request from '@/utils/request'

// IP流量监控 VO
export type IpTrafficVO = {
  deleted?: boolean // 是否删除
  ipAddress?: string // IP地址
  inboundTraffic?: number // 入站流量
  outboundTraffic?: number // 出站流量
  trafficTime?: Date // 流量统计时间
  accessFrequency?: boolean // 访问频率
  trafficRate?: number // 流量速率，单位为Mbps
  createTime?: Date // 创建时间
}

const prefix = '/admin-api/system/ip-traffic'

export type ListQueryParams = CommonQueryParams & Partial<IpTrafficVO>

// 查询IP流量监控分页
export const getList = (params: ListQueryParams) => {
  return request.get<PaginatedList<IpTrafficVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const getDetail = (id: number) => {
  return request.get<IpTrafficVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const createIpTraffic = (data: IpTrafficVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateIpTraffic = (data: IpTrafficVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deleteIpTraffic = (id: number) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}

export const exportIpTraffic = (params?: ListQueryParams) => {
  return request.download({
    url: `${prefix}/export-excel`,
    params: params,
    filename: 'IP流量监控',
  })
}
