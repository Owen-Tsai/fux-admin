import {
  getTaskReturnOptions,
  approveTask,
  rejectTask,
  returnTaskToStart,
  returnTask,
} from '@/api/business'
import useTabsStore from '@/stores/tabs'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const KEY_RETURN_TO_STARTER = 'RETURN_TO_STARTER'

const useAudit = (formRef: Ref<FormInstanceFunctions | null>) => {
  const route = useRoute()
  const applyId = route.query.applyId as string
  const taskId = route.query.taskId as string
  const message = useMessage()
  const loading = ref(false)

  const { removeTab } = useTabsStore()

  const { data: taskRtnOpts, execute } = useRequest(() => getTaskReturnOptions(taskId), {
    onSuccess: () => {
      taskRtnOpts.value?.push({
        name: '发起人',
        taskDefinitionKey: KEY_RETURN_TO_STARTER,
      })
    },
  })

  if (route.query.taskKey !== 'All') {
    execute()
  }

  const state = ref<{
    conclusion?: string
    reason?: string
    rtnToTaskKey?: string
    fields?: Record<string, any>
  }>({})

  const onApprove = async () => {
    await approveTask({
      id: taskId,
      applyId,
      reason: state.value.reason || '',
      fields: state.value.fields || {},
    })
  }

  const onReject = async () => {
    await rejectTask({
      id: taskId,
      applyId,
      reason: state.value.reason || '',
      fields: state.value.fields || {},
    })
  }

  const onReturn = async () => {
    if (state.value.rtnToTaskKey === KEY_RETURN_TO_STARTER) {
      await returnTaskToStart({
        id: taskId,
        applyId,
        reason: state.value.reason || '',
        fields: state.value.fields || {},
      })
    } else {
      await returnTask({
        id: taskId,
        applyId,
        reason: state.value.reason || '',
        fields: state.value.fields || {},
        targetTaskDefinitionKey: state.value.rtnToTaskKey,
      })
    }
  }

  const onSubmit = async () => {
    // TODO: 提交审核结果时一并保存 fieldsInteractivity 允许编辑时的表单数据
    // 直接取出 FormRenderer 的 formData 提交
    loading.value = true
    try {
      const res = await formRef.value?.validate()
      if (res === true) {
        switch (state.value.conclusion) {
          case 'APPROVE':
            await onApprove()
            break
          case 'REJECT':
            await onReject()
            break
          case 'RETURN':
            await onReturn()
            break
        }
        message.success('提交成功')
        removeTab(route.fullPath)
      }
    } catch (error) {
      console.log(error)
      message.error('提交失败')
    } finally {
      loading.value = false
    }
  }

  return {
    taskRtnOpts,
    onSubmit,
    state,
    loading,
  }
}

export default useAudit
