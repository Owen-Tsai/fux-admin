import { set } from 'lodash-es'
import dayjs from 'dayjs'
import { emitter, LifecyclePhases } from '@fusionx/core/utils/emitter'
import { useBusinessCtxProvide } from '@fusionx/core/hooks'
import { getApplyDetail, getTaskInfo } from '@/api/business'
import FormRenderer from '@fusionx/core/form-renderer/index.vue'
import type { PlanVO } from '@/api/app/plan'
import type { AppVO } from '@/api/app/app'
import type { AppSchema } from '@fusionx/core/types'

const useData = (fuxRenderer: Ref<InstanceType<typeof FormRenderer> | null>) => {
  const { params, query } = useRoute()
  const appId = params.appId as string
  const applyId = query.applyId as string
  const taskId = query.taskId as string
  const processId = query.processInstanceId as string

  const loading = ref(true)
  const appSchema = ref<AppSchema>()
  const formData = ref<Record<string, any>>({})
  const plan = ref<PlanVO>()
  const planId = ref<string>('')
  const app = ref<AppVO>()
  const starter = ref<string>()
  const submitTime = ref<string>()

  useBusinessCtxProvide({ appId, planId, applyId })

  const loadApplyDetail = async () => {
    const res = await getApplyDetail(appId, applyId)
    const taskInfo = await getTaskInfo(processId, taskId)
    appSchema.value = JSON.parse(res.schema)
    formData.value = res.data
    plan.value = res.plan
    planId.value = plan.value?.id || ''
    app.value = res.applicationDO
    starter.value = taskInfo.starter
    submitTime.value = dayjs(taskInfo.submitTime).format('YYYY-MM-DD HH:mm:ss')

    nextTick(fillFormData)
    loading.value = false
  }

  const fillFormData = () => {
    const dataToFill: Record<string, any> = {}
    const formDataKeys = Object.keys(formData.value)
    formDataKeys.forEach((key) => {
      if (!formData.value[key]) return
      const fields = Object.keys(formData.value[key])
      fields.forEach((field) => {
        set(dataToFill, `${key}:${field}`, formData.value[key][field])
      })
    })

    nextTick(() => {
      fuxRenderer.value?.setFormData(dataToFill)
      nextTick(() => {
        emitter.emit(LifecyclePhases.LOADED)
      })
    })
  }

  loadApplyDetail()

  return {
    loading,
    appSchema,
    formData,
    plan,
    app,
    starter,
    submitTime,
  }
}

export default useData
