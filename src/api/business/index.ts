import request from '@/utils/request'
import type { PlanVO } from '@/api/app/plan'
import type { AppVO } from '@/api/app/app'

export type ListQueryParams = CommonQueryParams & {
  taskKey: string
  startUser?: string
  submitTime?: string[]
  createTime?: string[]
  appId: string
  auditProcess?: string
}

export type AuditEntryVO = {
  appId: string
  auditProcess: string
  comApplyId: string
  comApplyName: string
  createTime: number
  idCard: string
  startUser: string
  processInstanceId: string
  submitTime: number
  taskName: string
  taskId: string
}

export type ApplyDetailVO = {
  schema: string
  data: Record<string, any>
  plan: PlanVO
  applicationDO: AppVO
}

/** 当前环节的流程任务信息 */
export type TaskInfoVO = {
  starter: string
  createTime: string
  name: string
  userType: string
  taskId: string
  submitTime: string
}

export type TimelineData = Array<{
  nodeColor: string
  operator: string
  operationResult: string
  operationResultCode: number
  inProcess: boolean
  operationTime: string
  operationRemark: string
}>

export const getAuditList = (params: ListQueryParams) => {
  const { appId, taskKey, startUser, submitTime, pageNo, pageSize, auditProcess } = params
  const url =
    taskKey === 'All'
      ? `/com-apply/get-apply-info-repertory?appId=${appId}`
      : `/fux-bpm/get-my-task?actId=${taskKey}`

  return request.get<PaginatedList<AuditEntryVO>>({
    url,
    params: {
      startUser,
      submitTime,
      pageNo,
      pageSize,
      auditProcess,
    },
  })
}

export const getTaskInfo = (processId: string, taskId: string) => {
  return request.get<TaskInfoVO>({
    url: `/fux-bpm/get-process-info`,
    params: {
      processId,
      taskId,
    },
  })
}

export const getApplyDetail = (appId: string, applyId: string) => {
  return request.get<ApplyDetailVO>({
    url: `/fusionx/framework/data-echo`,
    params: {
      appId,
      targetId: applyId,
    },
  })
}

export const getAuditTimeline = (processId: string) => {
  return request.get<TimelineData>({
    url: `/fux-bpm/get-process-log?processInstanceId=${processId}`,
  })
}

/**
 * 根据当前任务节点，获取退回时可以选择的退回到的节点
 * @param taskId 任务ID
 */
export const getTaskReturnOptions = (taskId: string) => {
  return request.get<Array<{ name: string; taskDefinitionKey: string }>>({
    url: `bpm/task/list-by-return?id=${taskId}`,
  })
}

export type TaskVO = {
  id: string
  reason: string
  fields?: object
  targetTaskDefinitionKey?: string
}

export const approveTask = (data: TaskVO) => {
  return request.put({ url: '/bpm/task/approve', data })
}

export const rejectTask = (data: TaskVO) => {
  return request.put({ url: '/bpm/task/reject', data })
}

export const returnTaskToStart = (data: TaskVO) => {
  return request.put({
    url: '/fusionx/framework/return-to-initiator',
    data,
  })
}

export const returnTask = (data: TaskVO) => {
  return request.put({ url: '/bpm/task/return', data })
}
