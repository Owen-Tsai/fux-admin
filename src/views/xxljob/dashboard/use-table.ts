import type { FormInstanceFunctions } from 'tdesign-vue-next'

export const useTable = (formRef: Ref<FormInstanceFunctions | null>) => {
  const dateDuring = ref<string[]>([])

  const panelGroupData = ref<{
    jobInfoCount: number | null
    jobLogCount: number | null
    executorCount: number | null
  }>({
    jobInfoCount: null,
    jobLogCount: null,
    executorCount: null,
  })

  const lineChartData = ref<{
    successData: number[]
    failData: number[]
    runningData: number[]
    lineCharDates: string[]
  }>({
    successData: [],
    failData: [],
    runningData: [],
    lineCharDates: [],
  })

  const pieCharData = ref<{
    jobSuccess: number
    jobFail: number
    jobRunning: number
  }>({
    jobSuccess: 0,
    jobFail: 0,
    jobRunning: 0,
  })

  return {
    panelGroupData
  }
}
