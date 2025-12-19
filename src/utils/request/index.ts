import { saveAs } from 'file-saver'
import service from './service'
import { LoadingPlugin } from 'tdesign-vue-next'
import type { AxiosRequestConfig } from 'axios'

const request = <T = any>(options: AxiosRequestConfig) => {
  const { url, method, data, params, responseType, ...rest } = options

  return service<T>({
    url,
    method,
    data,
    params,
    responseType,
    ...rest,
  })
}

export default {
  get: async <T = any>(options: AxiosRequestConfig) => {
    const res = await request<T>({ ...options, method: 'GET' })
    return res.data
  },
  getRaw: async <T = any>(options: AxiosRequestConfig) => {
    const res = await request<T>({ ...options, method: 'GET' })
    return res
  },
  post: async <T = any>(options: AxiosRequestConfig) => {
    const res = await request<T>({ ...options, method: 'POST' })
    return res.data
  },
  postRaw: async <T = any>(options: AxiosRequestConfig) => {
    const res = await request<T>({ ...options, method: 'POST' })
    return res as T
  },
  put: async <T = any>(options: AxiosRequestConfig) => {
    const res = await request<T>({ ...options, method: 'PUT' })
    return res.data
  },
  delete: async <T = any>(options: AxiosRequestConfig) => {
    const res = await request<T>({ ...options, method: 'DELETE' })
    return res.data
  },
  download: async (options: AxiosRequestConfig & { filename?: string }) => {
    LoadingPlugin(true)
    try {
      const res = await request({ ...options, method: 'GET', responseType: 'blob' })
      const blob = new Blob([res as unknown as ArrayBuffer])
      saveAs(blob, options.filename)
      return res
    } catch (e) {
      throw e
    } finally {
      LoadingPlugin(false)
    }
  },
  upload: async <T = any>(options: AxiosRequestConfig) => {
    const res = await request({
      ...options,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
    })
    return res as unknown as Promise<{ code: number; data: T; msg?: string }>
  },
}
