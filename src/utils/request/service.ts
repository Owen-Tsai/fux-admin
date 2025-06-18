import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios'
import { buildReqInterceptors, buildRespInterceptors } from './interceptor'

export { reloginHint } from './interceptor'

const buildService = (config: CreateAxiosDefaults): AxiosInstance => {
  const service = axios.create(config)
  service.interceptors.request.use(...buildReqInterceptors())
  service.interceptors.response.use(...buildRespInterceptors(service))

  return service
}

export default buildService
