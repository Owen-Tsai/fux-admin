import request from '@/utils/request'

// 调度日志 VO
export type XxlJobLogVO = {
  id?: number // ID
  jobGroup?: number // 执行器ID
  jobId?: number // 任务ID
  executorAddress?: string // 执行器地址
  executorHandler?: string // Jobhandler
  executorParam?: string // 任务参数
  executorShardingParam?: string // 任务分片参数
  executorFailRetryCount?: number // 失败重试次数
  triggerTime?: Date // 调度时间
  triggerCode?: number // 调度结果
  triggerMsg?: string // 调度日志
  handleTime?: Date // 执行时间
  handleCode?: number // 执行状态
  handleMsg?: string // 执行日志
  alarmStatus?: number // 告警状态
  logStatus?: number // 日志状态
  timeScope?: string[]
}

export type XxlJobLogDetailCatVo = {
  logId: number | undefined
  fromLineNum: number
  toLineNum?: number
  logContent?: string
  end?: boolean
}

const prefix = '/xxljob/xxl-job-log'

export type ListQueryParams = CommonQueryParams & Partial<XxlJobLogVO>

// 查询调度日志分页
export const getXxlJobLogList = (params: ListQueryParams) => {
  return request.get<PaginatedList<XxlJobLogVO>>({
    url: `${prefix}/page`,
    params,
  })
}

export const getXxlJobLogDetail = (id: number) => {
  return request.get<XxlJobLogVO>({
    url: `${prefix}/get?id=${id}`,
  })
}

export const addXxlJobLog = (data: XxlJobLogVO) => {
  return request.post({
    url: `${prefix}/create`,
    data,
  })
}

export const updateXxlJobLog = (data: XxlJobLogVO) => {
  return request.put({
    url: `${prefix}/update`,
    data,
  })
}

export const deleteXxlJobLog = (id: number) => {
  return request.delete({
    url: `${prefix}/delete?id=${id}`,
  })
}

export const exportXxlJobLog = (params?: ListQueryParams) => {
  return request.download({
    url: `${prefix}/export-excel`,
    params: params,
    filename: '调度日志',
  })
}

export const getXxlLogDetailCat = (data: XxlJobLogDetailCatVo) => {
  return request.post<XxlJobLogDetailCatVo>({
    url: `${prefix}/log-detail-cat`,
    data,
  })
}

export const getDashBoardPanelInfo = () => {
  return request.get({
    url: `${prefix}/dashboard-panel-info`,
  })
}

export const getDashboardChartInfo = (data: any) => {
  return request.post({
    url: `${prefix}/dashboard-chart-info`,
    data,
  })
}
