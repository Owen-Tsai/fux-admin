import request from '@/utils/request'
import type { MenuVO } from './system/menu'

export type TokenVO = {
  id: number // 编号
  accessToken: string // 访问令牌
  refreshToken: string // 刷新令牌
  userId: number // 用户编号
  userType: number //用户类型
  clientId: string //客户端编号
  expiresTime: number //过期时间
}

export type CaptchaVO = {
  repData: {
    jigsawImageBase64: string
    originalImageBase64: string
    secretKey: string
    token: string
  }
  success: boolean
  repMsg: string | null
}

export type CaptchaValidationRespVO = {
  success: boolean
  repMsg: string | null
}

export type CaptchaValidationReqVO = {
  pointJson: string
  token: string
}

export type LoginReqVO = {
  username: string
  password: string
  captchaVerification?: string // only needed if captcha feature is enabled
}

export type LoginRespVO = {
  accessToken: string
  refreshToken: string
  userId: number
}

export type PermissionVO = {
  user: {
    id: number
    nickname: string
    avatar?: string
    deptId?: number
    mobile?: string
  }
  menus: MenuVO[]
  roles: string[]
  permissions: string[]
}

const prefix = '/system'

export const getCaptcha = () => {
  return request.postRaw<CaptchaVO>({
    url: `${prefix}/captcha/get`,
    data: {
      captchaType: 'blockPuzzle',
    },
    headers: {
      requireToken: false,
    },
  })
}

export const checkCaptcha = (params: CaptchaValidationReqVO) => {
  return request.postRaw<CaptchaValidationRespVO>({
    url: `${prefix}/captcha/check`,
    data: {
      ...params,
      captchaType: 'blockPuzzle',
    },
  })
}

export const login = (data: LoginReqVO) => {
  return request.post<LoginRespVO>({
    url: `${prefix}/auth/login`,
    headers: {
      requireToken: false,
    },
    data,
  })
}

export const logout = () => {
  return request.postRaw({
    url: `${prefix}/auth/logout`,
  })
}

export const getPermissionInfo = () => {
  return request.get<PermissionVO>({
    url: `${prefix}/auth/get-permission-info`,
  })
}
