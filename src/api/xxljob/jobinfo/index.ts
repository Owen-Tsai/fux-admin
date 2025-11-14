import request from '@/utils/request'

// 任务管理 VO
export type JobInfoVO = {
  id?: number // ID
  jobGroup?: number // 执行器主键ID
  jobDesc?: string // 任务描述
  addTime?: Date // 添加时间
  author?: string // 作者
  alarmEmail?: string // 报警邮件
  scheduleType?: string // 调度类型
  scheduleConf?: string // 调度配置，值含义取决于调度类型
  misfireStrategy?: string // 调度过期策略
  executorRouteStrategy?: string // 执行器路由策略
  executorHandler?: string // 执行器任务handler
  executorParam?: string // 执行器任务参数
  executorBlockStrategy?: string // 阻塞处理策略
  executorTimeout?: number // 任务执行超时时间，单位秒
  executorFailRetryCount?: number // 失败重试次数
  glueType?: string // GLUE类型
  glueSource?: string // GLUE源代码
  glueRemark?: string // GLUE备注
  glueUpdatetime?: Date // GLUE更新时间
  childJobid?: string // 子任务ID，多个逗号分隔
  triggerStatus?: number // 调度状态
}

const prefix = '/xxljob/job-info'

export type ListQueryParams = CommonQueryParams & Partial<JobInfoVO>

export type JobTriggerParams = {
  id: number | undefined
  executorParam: string
  addressList: string
}

// 查询任务管理分页
export const getJobInfoList = (params: ListQueryParams) => {
  return request.get<PaginatedList<JobInfoVO>>({
    url: `${prefix}/page`,
    params,
  })
}

// 查询任务管理列表
export const getJobInfoListAll = (data: ListQueryParams) => {
  return request.post<JobInfoVO[]>({
    url: `${prefix}/list-all`,
    data,
  })
}

export const getJobInfoDetail = (id: number) => {
  return request.get<JobInfoVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const addJobInfo = (data: JobInfoVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateJobInfo = (data: JobInfoVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deleteJobInfo = (id: number) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}

export const exportJobInfo = (params?: ListQueryParams) => {
  return request.download({
    url: `${prefix}/export-excel`,
    params: params,
    filename: '任务管理',
  })
}

// 启动任务
export const startJob = (id: number) => {
  return request.get({
    url: `${prefix}/start?id=${id}`,
  })
}

 // 停止任务
export const stopJob = (id: number) => {
  return request.get({
    url: `${prefix}/stop?id=${id}`,
  })
}

// 执行一次
export const triggerJob = (data: JobTriggerParams) => {
  return request.post({
    url: `${prefix}/trigger`,
    data,
  })
}

// 下次执行时间
export const nextTriggerTime = (data: { scheduleType: string; scheduleConf: string }) => {
  return request.post<string[]>({
    url: `${prefix}/next-trigger-time`,
    data,
  })
}
