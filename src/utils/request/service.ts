import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { MessagePlugin } from 'tdesign-vue-next'
import qs from 'qs'
import { getToken, setToken, getRefreshToken } from '@/utils/auth'
import useUserStore from '@/stores/user'
import errorCode from './error-code'

const whiteList = ['/login', '/refresh-token']
const ignoredErrorMsgs = ['无效的刷新令牌', '刷新令牌已过期']
// 令牌是否正在刷新
let isTokenRefresh = false
// 请求队列，当令牌刷新时，将请求添加到请求队列中，等待令牌刷新后重试
const requestQueue: any[] = []

export const reloginHint = { show: false }

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000,
  paramsSerializer: {
    indexes: null,
    serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  },
})

const refreshToken = async () => {
  return await axios.post(
    `${import.meta.env.VITE_API_URL}/system/auth/refresh-token?refreshToken=${getRefreshToken()}`,
  )
}

const redirectForAuth = () => {
  if (!reloginHint.show) {
    if (window.location.href.includes('login')) {
      return
    }

    reloginHint.show = true

    const dialog = useDialog()

    const instance = dialog.confirm({
      header: '登录超时',
      body: '登陆状态已过期。您可以留在当前页面，或重新进行登录。',
      confirmBtn: {
        content: '重新登录',
        onClick: async () => {
          await useUserStore().logout()
          reloginHint.show = false
          window.location.href = '/login'
        },
      },
      cancelBtn: {
        content: '取消',
        onClick: () => {
          reloginHint.show = false
          instance.destroy()
        },
      },
    })
  }

  return Promise.reject('登录超时')
}

const handleInvalidToken = async (config: InternalAxiosRequestConfig, service: AxiosInstance) => {
  if (!isTokenRefresh) {
    // 当前没有在刷新令牌
    isTokenRefresh = true
    if (!getRefreshToken()) {
      // 没有可用的刷新令牌时，强制重新登录
      return redirectForAuth()
    }
    // 使用刷新令牌请求新的令牌
    try {
      const r = await refreshToken()
      setToken(r.data.data)
      config.headers.Authorization = `Bearer ${getToken()}`
      // 释放请求队列
      requestQueue.forEach((fn) => fn())
      requestQueue.length = 0
      // 重试当前请求
      return service(config)
    } catch (error) {
      console.log(error)
      // 刷新令牌失败，强制重新登录
      requestQueue.forEach((fn) => fn())
      return redirectForAuth()
    } finally {
      isTokenRefresh = false
    }
  } else {
    // 当前正在刷新令牌，将当前请求添加到请求队列中
    return new Promise((resolve) => {
      requestQueue.push(() => {
        config.headers.Authorization = `Bearer ${getToken()}`
        resolve(service(config))
      })
    })
  }
}

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 判断请求是否需要携带令牌
    const requireToken =
      config.url && whiteList.includes(config.url)
        ? false
        : (config.headers || {}).requireToken !== false

    const token = getToken()
    if (requireToken && token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 当请求头表明需要传输 urlencoded 数据时，对数据进行转换
    if (
      config.method === 'post' &&
      config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(config.data)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  async (res) => {
    const { config, request } = res
    let data = res.data
    const code: number = data.code || 200

    // 响应为 blob 或 arraybuffer 时，直接返回
    if (request.responseType === 'blob' || request.responseType === 'arraybuffer') {
      if (data.type !== 'application/json') {
        return res.data
      }
      data = await new Response(res.data).json()
    }

    // 处理错误
    const msg = res.data.msg || errorCode[code] || errorCode['default']
    if (ignoredErrorMsgs.includes(msg)) {
      // 错误属于忽略信息时，不进行提示
      return Promise.reject(msg)
    } else if (code === 401) {
      // 不合法的令牌
      handleInvalidToken(config, service)
    } else if (code !== 200) {
      if (msg === '无效的刷新令牌') {
        console.log(msg)
      } else {
        MessagePlugin.error(msg)
      }

      return Promise.reject(msg)
    } else {
      return data
    }
  },
  (error) => {
    console.error(error)
    const { message, response, status, config } = error

    let msg = ''

    if (status === 401) {
      handleInvalidToken(config, service)
      return
    }

    if (message === 'Network Error') {
      msg = '网络连接异常'
    } else if (message.includes('timeout')) {
      msg = '服务器响应超时'
    } else if (message.includes('Request failed with status code')) {
      if (response.data.msg) {
        msg = response.data.msg
      } else {
        msg = '系统接口' + msg.substring(msg.length - 3) + '异常'
      }
    }

    MessagePlugin.error(msg)
    return Promise.reject(msg)
  },
)

export default service
