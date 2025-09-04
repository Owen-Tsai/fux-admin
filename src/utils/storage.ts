import Storage from 'web-storage-cache'

export const localCache = new Storage({
  storage: 'localStorage',
})

export const sessionCache = new Storage({
  storage: 'sessionStorage',
})
