import request from '@/utils/request'

// IP白名单和黑名单 VO
export type IpListVO = {
  deleted?: boolean // 是否删除
  id?: number // id自增
  ipAddress?: string // IP地址
  description?: string // 描述信息
  listType?: boolean // 列表类型
  createTime?: string // 创建时间
}

const prefix = '/admin-api/system/ip-list'

export type ListQueryParams = CommonQueryParams & Partial<IpListVO>

// 查询IP白名单和黑名单分页
export const getList = (params: ListQueryParams) => {
  return request.get<PaginatedList<IpListVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const getDetail = (id: number) => {
  return request.get<IpListVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const createIpList = (data: IpListVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateIpList = (data: IpListVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deleteIpList = (id: number) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}

export const exportIpList = (params?: ListQueryParams) => {
  return request.download({
    url: `${prefix}/export-excel`,
    params: params,
    filename: 'IP白名单和黑名单',
  })
}
