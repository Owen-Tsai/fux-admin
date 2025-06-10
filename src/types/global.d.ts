export {}

declare module 'vue' {
  export interface GlobalComponents {
    Scrollbar: typeof import('custom-vue-scrollbar').default
    Chart: typeof import('vue-echarts').default
  }
}

declare global {
  const useRequest: typeof import('@/hooks/use-request').default
  const useDict: typeof import('@/hooks/use-dict').default
}
