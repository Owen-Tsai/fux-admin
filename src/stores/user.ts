import { removeToken, setToken } from '@/utils/auth'
import { generateRoutes } from '@/utils/route'
import { sessionCache } from '@/utils/storage'
import {
  login as doLogin,
  logout as doLogout,
  getPermissionInfo,
  type LoginReqVO,
  type LoginRespVO,
  type PermissionVO,
} from '@/api/auth'
import defaultAvatar from '@/assets/img/default-avatar.png'
import type { RouteRecordRaw } from 'vue-router'

const CACHE_KEY = 'permission-info'

export default defineStore('user', () => {
  const uid = ref<number>()
  const isUserInfoReady = ref(false)
  const user = ref<PermissionVO['user'] | undefined>()
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  const routerMap = ref<PermissionVO['menus']>()
  const routes = shallowRef<RouteRecordRaw[]>()

  const login = async (loginReqVO: LoginReqVO) => {
    const { username, password, captchaVerification } = loginReqVO
    return new Promise<LoginRespVO>((resolve, reject) => {
      doLogin({
        username: username.trim(),
        password,
        captchaVerification,
      })
        .then((data) => {
          const { accessToken, refreshToken, userId } = data
          setToken({ accessToken, refreshToken })
          uid.value = userId
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const getUserInfo = () => {
    const process = (data: PermissionVO) => {
      const { user: u, roles: rs, permissions: ps, menus } = data

      roles.value = rs
      permissions.value = ps
      routerMap.value = menus
      user.value = {
        ...u,
        avatar: u.avatar || defaultAvatar,
      }
      uid.value = user.value.id as number

      isUserInfoReady.value = true
      routes.value = generateRoutes(routerMap.value)
    }

    const permissionInfo = sessionCache.get(CACHE_KEY)

    if (permissionInfo) {
      return new Promise<PermissionVO>((resolve) => {
        process(permissionInfo)
        resolve(permissionInfo)
      })
    } else {
      return new Promise<PermissionVO>((resolve, reject) => {
        getPermissionInfo()
          .then((res) => {
            process(res)
            sessionCache.set(CACHE_KEY, res)
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  }

  const logout = () => {
    return new Promise((resolve, reject) => {
      doLogout()
        .then(() => {
          uid.value = undefined
          isUserInfoReady.value = false
          user.value = undefined
          roles.value = []
          permissions.value = []
          routerMap.value = undefined
          routes.value = []
          sessionCache.delete(CACHE_KEY)
          removeToken()
          resolve(true)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  return {
    uid,
    isUserInfoReady,
    user,
    roles,
    permissions,
    routerMap,
    routes,
    login,
    getUserInfo,
    logout,
  }
})
