export {}

declare module 'vue' {
  export interface GlobalComponents {
    Scrollbar: typeof import('custom-vue-scrollbar').default
  }
}

declare global {
  const useRequest: typeof import('@/utils/use-request').default
}
