import { localCache } from '@/utils/storage'

type Token = {
  accessToken: string
  refreshToken: string
}

const ACCESS_TOKEN = 'access-token'
const REFRESH_TOKEN = 'refresh-token'

export const getToken = (): string | null => {
  return localCache.get(ACCESS_TOKEN)
}

export const getRefreshToken = (): string | null => {
  return localCache.get(REFRESH_TOKEN)
}

export const setToken = (token: Token) => {
  localCache.set(ACCESS_TOKEN, token.accessToken)
  localCache.set(REFRESH_TOKEN, token.refreshToken)
}

export const removeToken = () => {
  localCache.delete(ACCESS_TOKEN)
  localCache.delete(REFRESH_TOKEN)
}
