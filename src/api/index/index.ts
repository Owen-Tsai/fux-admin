import request from '@/utils/request'

export type StatisticVO = {
  title: string
  value: number
  suffix?: string
  trend?: 'increase' | 'decrease'
}

export type CalendarDataVO = {
  [x: number]: Array<{
    title: string
  }>
}

export const getIndexData = () => {
  return request.get({
    url: '/system/application/get-index-data',
  })
}

export const getApplications = () => {
  return request.get({
    url: '/system/application/get-index-app-Data',
  })
}
