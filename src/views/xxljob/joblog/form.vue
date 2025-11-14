
<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增' : '编辑'"
    :confirm-loading="loading"
    width="560px"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm
        ref="formRef"
        :label-width="100"
        :data="formData"
        :rules="rules"
      >
         <TFormItem label="执行器ID" name="jobGroup">
          <TInput v-model:value="formData.jobGroup" placeholder="请输入执行器ID" />
        </TFormItem>
         <TFormItem label="任务ID" name="jobId">
          <TInput v-model:value="formData.jobId" placeholder="请输入任务ID" />
        </TFormItem>
         <TFormItem label="执行器地址" name="executorAddress">
          <TInput v-model:value="formData.executorAddress" placeholder="请输入执行器地址" />
        </TFormItem>
         <TFormItem label="Jobhandler" name="executorHandler">
          <TInput v-model:value="formData.executorHandler" placeholder="请输入Jobhandler" />
        </TFormItem>
         <TFormItem label="任务参数" name="executorParam">
          <TInput v-model:value="formData.executorParam" placeholder="请输入任务参数" />
        </TFormItem>
         <TFormItem label="任务分片参数" name="executorShardingParam">
          <TInput v-model:value="formData.executorShardingParam" placeholder="请输入任务分片参数" />
        </TFormItem>
         <TFormItem label="失败重试次数" name="executorFailRetryCount">
          <TInput v-model:value="formData.executorFailRetryCount" placeholder="请输入失败重试次数" />
        </TFormItem>
         <TFormItem label="调度时间" name="triggerTime">
          <TDatePicker v-model:value="formData.triggerTime" value-format="x" placeholder="请选择调度时间" />
        </TFormItem>
         <TFormItem label="调度结果" name="triggerCode">
          <TInput v-model:value="formData.triggerCode" placeholder="请输入调度结果" />
        </TFormItem>
         <TFormItem label="调度日志" name="triggerMsg">
          <TInput v-model:value="formData.triggerMsg" placeholder="请输入调度日志" />
        </TFormItem>
         <TFormItem label="执行时间" name="handleTime">
          <TDatePicker v-model:value="formData.handleTime" value-format="x" placeholder="请选择执行时间" />
        </TFormItem>
         <TFormItem label="执行状态" name="handleCode">
          <TInput v-model:value="formData.handleCode" placeholder="请输入执行状态" />
        </TFormItem>
         <TFormItem label="执行日志" name="handleMsg">
          <TInput v-model:value="formData.handleMsg" placeholder="请输入执行日志" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addXxlJobLog, updateXxlJobLog, getXxlJobLogDetail, type XxlJobLogVO } from '@/api/xxljob/joblog'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'
  import useDict from '@/hooks/use-dict'

  const rules: FormProps['rules'] = {
        jobGroup: [{ required: true, message: '执行器ID不能为空', trigger: 'blur' }],
        jobId: [{ required: true, message: '任务ID不能为空', trigger: 'blur' }],
        executorFailRetryCount: [{ required: true, message: '失败重试次数不能为空', trigger: 'blur' }],
        triggerCode: [{ required: true, message: '调度结果不能为空', trigger: 'blur' }],
        handleCode: [{ required: true, message: '执行状态不能为空', trigger: 'blur' }],
        alarmStatus: [{ required: true, message: '告警状态不能为空', trigger: 'blur' }],
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<XxlJobLogVO>({})

  const [
  ] = useDict(
  )

  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addXxlJobLog(formData.value)
        } else {
          await updateXxlJobLog(formData.value)
        }

        emit('success')
        visible.value = false
      }
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }

  const loadData = async (id: number) => {
    loading.value = true
    const res = await getXxlJobLogDetail(id)
    formData.value = res
    loading.value = false
  }

  const open = (id?: number) => {
    formRef.value?.reset({ type: 'initial' })
    formData.value.id = undefined
    mode.value = 'create'

    if (id) {
      loadData(id)
      mode.value = 'update'
    } else {
      mode.value = 'create'
    }

    visible.value = true
  }

  defineExpose({ open })
</script>
