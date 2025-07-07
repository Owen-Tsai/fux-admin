import request from '@/utils/request'

// 异常IP管理 VO
export type IpManagementVO = {
  id?: number // id自增
  deleted?: boolean // 是否删除
  abnormalDetail?: string // 访问详情
  createTime?: Date // 添加时间
  ipAddress?: string // 异常 IP 地址
  abnormalType?: number // 异常类型
  accessTime?: Date // 访问时间
  accessResource?: string // 访问的资源
  handlingStatus?: number // 处理状态
}

const prefix = '/admin-api/system/ip-management'

export type ListQueryParams = CommonQueryParams & Partial<IpManagementVO>

// 查询异常IP管理分页
export const getList = (params: ListQueryParams) => {
  return request.get<PaginatedList<IpManagementVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const getDetail = (id: number) => {
  return request.get<IpManagementVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const createIpManagement = (data: IpManagementVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateIpManagement = (data: IpManagementVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deleteIpManagement = (id: number) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}

export const exportIpManagement = (params?: ListQueryParams) => {
  return request.download({
    url: `${prefix}/export-excel`,
    params: params,
    filename: '异常IP管理',
  })
}
