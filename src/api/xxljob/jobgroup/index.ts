import request from '@/utils/request'

// 执行器信息 VO
export type JobGroupVO = {
  id?: number // ID
  appName?: string // 执行器名称
  title?: string // 应用名称
  addressType?: number // 注册方式
  addressList?: string // 执行机器地址
  registryList?: string[]
}

const prefix = '/xxljob/job-group'

export type ListQueryParams = CommonQueryParams & Partial<JobGroupVO>

// 查询执行器信息分页
export const getJobGroupList = (params: ListQueryParams) => {
  return request.get<PaginatedList<JobGroupVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const getJobGroupDetail = (id: number): Promise<JobGroupVO> => {
  return request.get<JobGroupVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const addJobGroup = (data: JobGroupVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateJobGroup = (data: JobGroupVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deleteJobGroup = (id: number) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}

export const exportJobGroup = (params?: ListQueryParams) => {
  return request.download({
    url: `${prefix}/export-excel`,
    params: params,
    filename: '执行器信息表',
  })
}

export const getGroupListAll = () => {
  return request.get<JobGroupVO[]>({
    url: `${prefix}/listAll`,
  })
}
