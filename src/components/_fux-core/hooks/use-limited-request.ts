import request from '@/utils/request'
import type { AxiosRequestConfig } from 'axios'

export const useLimitedRequest = () => {
  const get = (params: AxiosRequestConfig) =>
    request.get({
      baseURL: import.meta.env.VITE_API_URL,
      ...params,
    })

  return {
    get,
    getOpen: get,
  }
}
