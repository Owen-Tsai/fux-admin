import request from '@/utils/request'
import type { AxiosRequestConfig } from 'axios'

export const useLimitedRequest = () => {
  const logger = useLogger()

  const get = (_?: any) =>
    new Promise((resolve) => {
      logger.info(import.meta.url, 'fux-core 用户定义的脚本在管理端调用`$request.get`，已跳过执行')
      resolve({})
    })

  return {
    get,
    getOpen: get,
  }
}
