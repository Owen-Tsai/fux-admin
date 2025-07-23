import request from '@/utils/request'

export type JobVO = {
  createTime?: string
  cronExpression?: string
  handlerName?: string
  handlerParam?: string
  id?: number
  monitorTimeout?: number
  name?: string
  retryCount?: number
  retryInterval?: number
  status?: number
}

export type ListQueryParams = CommonQueryParams & {
  name?: string
  handlerName?: string
  status?: number
}

const prefix = '/infra/job'

export const getJobList = (params: ListQueryParams) => {
  return request.get<PaginatedList<JobVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const getJobDetail = (id: number) => {
  return request.get<JobVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const createJob = (data: JobVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateJob = (data: JobVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deleteJob = (id: number) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}

export const exportExcel = (params: ListQueryParams) => {
  return request.download({
    url: `${prefix}/export-excel`,
    params,
    filename: '定时任务.xlsx',
  })
}

export const updateJobStatus = (id: number, status: number) => {
  return request.put({
    url: `${prefix}/update-status`,
    params: {
      id,
      status,
    },
  })
}

export const runJob = (id: number) => {
  return request.put({
    url: `${prefix}/trigger?id=${id}`,
  })
}

export const getJobScheduledTimes = (id: number) => {
  return request.get<number[]>({
    url: `${prefix}/get-next-times?id=${id}`,
  })
}
