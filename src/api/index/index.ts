import request from '@/utils/request'

export type StatisticsVO = Array<{
  title: string
  value: number
  suffix?: string
  trend?: 'increase' | 'decrease'
}>

export type CalendarDataVO = {
  [x: number]: Array<{
    title: string
  }>
}

export type FrequentAppsVO = Array<{
  id: string
  name: string // 审核环节（任务节点）名称
  icon: string
  appName: string // 应用名称
  path: string
}>

export const getIndexData = () => {
  return request.get({
    url: '/system/application/get-index-data',
  })
}

export const getApplications = () => {
  return request.get<FrequentAppsVO>({
    url: '/system/application/get-frequent-apps',
  })
}
